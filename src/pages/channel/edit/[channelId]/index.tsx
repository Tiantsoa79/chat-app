import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import Navbar from '@/components/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useForm } from 'react-hook-form';

interface User {
  id: number;
  name: string;
}

const editChannelForm = () => {
  const router = useRouter();
  const { channelId } = router.query;
  const [users, setUsers] = useState<User[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors }, watch } = useForm();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = Cookies.get('token');
      const response = await axios.get('http://localhost:8080/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data.users);
    } catch (error) {
      console.error(error);
    }
  };

  const handleMemberSelection = (userId: number) => {
    if (selectedMembers.includes(userId)) {
      setSelectedMembers(selectedMembers.filter((id) => id !== userId));
    } else {
      setSelectedMembers([...selectedMembers, userId]);
    }
  };

  const onSubmit = async (data: any) => {
    try {
      const token = Cookies.get('token');

      const requestData = {
      type: data.type,
        members: selectedMembers
      };

      console.log(data.type)
      const response = await axios.post(`http://localhost:8080/channels/${channelId}/members`, requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 201 && response.data.status) {
        setSuccess(true);
        setError('');
        
        router.push(`/channel/${channelId}`);
        alert("members added successfully");
      } else {
        setError('User not found');
      }
    } catch (error) {
      console.error(error);
      setError('An error occurred');
    }
  };

  return (
    <div className="container-fluid d-flex flex-column min-vh-100">
      <div className="row flex-grow-1">
        <div className="col-md-3 bg-light p-3">
          <Navbar />
        </div>
        <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
          <h1>Edit Channel</h1>
          {success && <p>Member added successfully</p>}
          {error && <p>{error}</p>}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-outline mb-4">
              <label>Type:</label>
              <select
                name="type"
                className="form-select"
                aria-label="Default select example"
                {...register('type', { required: true })}
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
              {errors.type && <p>Type is required</p>}
            </div>
            {watch('type') === 'private' && (
              <div className="form-outline mb-4">
                <label>Members:</label>
                {users.length > 0 ? (
                  users.map((user) => (
                    <div key={user.id}>
                      <input
                        type="checkbox"
                        onChange={() => handleMemberSelection(user.id)}
                        checked={selectedMembers.includes(user.id)}
                      />
                      <label>{user.name}</label>
                    </div>
                  ))
                ) : (
                  <p>Loading users...</p>
                )}
              </div>
            )}
            <button className="editChannelButton btn btn-primary btn-block mb-4" type="submit">Edit Channel</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default editChannelForm;
