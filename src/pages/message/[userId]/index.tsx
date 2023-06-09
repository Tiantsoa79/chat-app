import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';

interface Message {
  id: number;
  senderId: number;
  channelId: number | null; 
  recipientId: number;
  content: string;
  updatedAt: string;
  createdAt: string;
}

const sendMessageForm = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const router = useRouter();
  const { userId } = router.query;
  const [createError, setCreateError] = useState(false);
  const [message, setMessage] = useState('');
  const token = Cookies.get('token');
  const [recipientName, setRecipientName] = useState();

  useEffect(() => {
     setRecipientName(Cookies.get('recipient'));
  })

  useEffect(() => {
    const fetchMessageData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/messages/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200 && response.data.status) {
          setMessages(response.data.messages);
        } else {
          setCreateError(true);
        }
      } catch (error) {
        console.error(error);
        setCreateError(true);
      }
    };

    if (userId) {
      fetchMessageData();
    }
  }, [userId]);

  const handleMessageChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  };
  const handleSendMessage = async () => {
    try {
      const response = await axios.post(
        'http://localhost:8080/message',
        {
          recipientId: userId,
          content: message,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201 && response.data.status) {
        setMessage('');
        router.reload();
        
      }
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <div className="container-fluid d-flex flex-column min-vh-100">
      <div className="row flex-grow-1">
        <div className="col-md-3 bg-light p-3">
          <Navbar />
        </div>
        <div className="col-md-9 bg-white p-3 d-flex flex-column justify-content-between">
          <div className="d-flex align-items-center">
            <h1>{recipientName}</h1>
          </div>
          {/* Chat Messages */}
          <div className="flex-grow-1 overflow-auto mt-3">
            {messages.map((message) => (
              <div key={message.id}>
                <h6>{message.sender.name} :  </h6>
                <p>{`Message: ${message.content}`}</p> 
              </div>
            ))}
          </div>
          {/* Chat Input */}
          <div className="mt-3  position-sticky bottom-0 mb-2">
            <div className="input-group">
            <textarea
          name="message"
          className="form-control"
          placeholder="Type your message"
          value={message}
          onChange={handleMessageChange}
        />
              <button className="sendMessageButton btn btn-primary" onClick={handleSendMessage}>
                Send Message
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default sendMessageForm;

