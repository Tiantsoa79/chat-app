import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import 'bootstrap/dist/css/bootstrap.min.css';

interface User {
    id: number;
    name: string;
    email: string;
    bio: string;
  }

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const router = useRouter();
  const [createError, setCreateError] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = Cookies.get('token');

        const response = await axios.get('http://localhost:8080/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200 && response.data.status) {
          setUsers(response.data.users);
        } else {
          setCreateError(true);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsers();
  }, []);

  const handleUserClick = (userId: number, name: string) => {
    Cookies.set('recipient', name);
    router.push(`/message/${userId}`);
  };


  return (
    <div>
      {users.map((user) => (
        <div className="list-group" key={user.id} onClick={() => handleUserClick(user.id, user.name)}>
          <p className="list-group-item h6">{user.name}</p>
          {/* Afficher d'autres détails du canal si nécessaire */}
        </div>
      ))}
    </div>
  );
};

export default Users;
