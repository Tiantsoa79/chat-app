import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';

interface Channel {
  id: number;
  name: string;
  type: string;
  ownerId: number;
  updatedAt: string;
  createdAt: string;
}

interface Message {
  id: number;
  senderId: number;
  channelId: number;
  recipientId: number | null;
  content: string;
  updatedAt: string;
  createdAt: string;
}

const sendMessageForm = () => {
  const [channel, setChannel] = useState<Channel | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const router = useRouter();
  const { channelId } = router.query;
  const [createError, setCreateError] = useState(false);
  const [message, setMessage] = useState('');
  const token = Cookies.get('token');

  useEffect(() => {
    const fetchChannelData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/channel/${channelId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
       console.log(response.data.channel.type);
       
        if (response.status === 200 && response.data.status) {
          setChannel(response.data.channel);
        } else {
          setCreateError(true);
        }
      } catch (error) {
        console.error(error);
        setCreateError(true);
        router.push(`/channels/create`);
      }
    };

    if (channelId) {
      fetchChannelData();
    }
  }, [channelId]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/messages/channel/${channelId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200 && response.data.status) {
          setMessages(response.data.messages);
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (channelId) {
      fetchMessages();
    }
  }, [channelId]);

  if (!channel) {
    return <p>Loading...</p>;
  }

  const handleAddMembers = () => {
    router.push(`/channel/edit/${channelId}`);
  };

  const handleMessageChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  };

  const handleSendMessage = async () => {
    try {
      const response = await axios.post(
        'http://localhost:8080/message',
        {
          channelId: channel.id,
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
          <div className="d-flex justify-content-between align-items-center">
            <h1>{channel.name}</h1>
            <button className="btn btn-outline-dark rounded-pill ml-5" onClick={handleAddMembers}>
              Edit
            </button>
          </div>
          {/* Chat Messages */}
          <div className="flex-grow-1 overflow-auto mt-3">
            {messages.map((message) => (
              <div key={message.id}>
                <h6>{message.sender.name} :  </h6>
                <p>{`Message: ${message.content}`}</p> 
                {/* <small>{`Channel ID: ${message.channelId}`}</small> */}
                
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

