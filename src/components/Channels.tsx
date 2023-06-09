import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import 'bootstrap/dist/css/bootstrap.min.css';

interface Channel {
  id: number;
  name: string;
  type: string;
  ownerId: number;
  updatedAt: string;
  createdAt: string;
  members: Member[];
}

interface Member {
  id: number;
  // Autres propriétés des membres
}

const Channels = () => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const token = Cookies.get('token');
        const idCurrent = +Cookies.get('id');
  
        const response = await axios.get('http://localhost:8080/channels', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        console.log('Response:', response.data);
  
        if (response.status === 200 && response.data.status) {
          const filteredChannels = response.data.channels.filter((channel: Channel) => {
            if (channel.type === 'public') {
              return true;
            } else if (channel.type === 'private' && channel.members) {
              for (const member of channel.members) {
                if (member.id === idCurrent) {
                  console.log('members', channel.members);
                  return true;
                }
              }
            } else if (channel.type === 'private' && channel.ownerId== idCurrent) {
              console.log('members', channel.members);
              return true;
            }
            
            return false;
          });
          
        
  
          console.log('Filtered Channels:', filteredChannels);
  
          setChannels(filteredChannels);
        } else {
          // Handle error or redirect to login/signup page
        }
      } catch (error) {
        console.error(error);
        // Handle error or redirect to login/signup page
      }
    };
  
    fetchChannels();
  }, []);
  

  const handleChannelClick = (channelId: number) => {
    router.push(`/channel/${channelId}`);
  };

  return (
    <div>
      {channels.map((channel) => (
        <div className="list-group" key={channel.id} onClick={() => handleChannelClick(channel.id)}>
          <p className="list-group-item h6">
            {channel.name}
            <br />
            <small> ({channel.type})</small>
          </p>
          {/* Afficher d'autres détails du canal si nécessaire */}
        </div>
      ))}
    </div>
  );
};

export default Channels;
