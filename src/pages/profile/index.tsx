import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar';// Importer le composant VerticalNavbar
import Cookies from 'js-cookie'; // Importer le package js-cookie
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';

interface User {
  name: string;
  email: string;
  bio: string;
  // Ajoutez d'autres propriétés si nécessaire
}

const editProfileForm = () => {
   const { register, handleSubmit, formState: { errors } } = useForm();
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();
    const [createError, setCreateError] = useState(false);
  const [editError, setEditError] = useState(false);

    useEffect(() => {
      const fetchUserData = async () => {
        try {
          const token = Cookies.get('token');
          console.log('Token:', token); // Afficher le contenu du cookie "token" dans la console
  
          // Effectuer la requête HTTP avec le token dans l'en-tête
          const response = await axios.get('http://localhost:8080/user', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
  
          if (response.status === 200 && response.data.status) {
            setUser(response.data.user);
          } else {
           setCreateError(true); 
          }
        } catch (error) {
          console.error(error);
          
        }
      };
  
      fetchUserData();
    }, []);
  
    const onSubmit = async (data: any) => {
      if (data.name === '') {
        delete data.name;
      }
      try {
        const token = Cookies.get('token');
        const response = await axios.put('http://localhost:8080/user', data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (response.status === 200) {
          router.reload();
        } else {
          setEditError(true);
        }
      } catch (error) {
        console.error(error);
        setEditError(true);
      }
    };
  
    if (!user) {
      return <p>Loading...</p>;
    }
  
    return (
<div className="container-fluid d-flex flex-column min-vh-100">
      <div className="row flex-grow-1">
        <div className="col-md-3 bg-light p-3">
          <Navbar />
        </div>
        <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
  <h1>Edit Profile</h1>
  {editError && <p>Error occurred while editing profile</p>}
  <form onSubmit={handleSubmit(onSubmit)}>
    <div className="form-outline mb-4">
      <input
       type="text" 
       name="name"
       placeholder={user.name}
      className="form-control form-control-lg"
      {...register('name')} />
      {errors.name && <p>Name is required</p>}
    </div>
    <div className="form-outline mb-4">
    <input  type="email" name="email" readonly value={user.email} />
    </div>
    <div className="form-outline mb-4">
      <input 
      type="password" name="currentPassword"
      placeholder='old password'
      {...register('oldPassword')}
      className="form-control form-control-lg" />
      {errors.oldPassword && <p>Old Password is required</p>}
    </div>
    <div className="form-outline mb-4">
      <input type="password" name="newPassword" placeholder='New password' {...register('password')}
      className="form-control form-control-lg" />
      {errors.password && <p>New Password is required</p>}
    </div>
    <div className="form-outline mb-4">
      <input type="password" name="confirmPassword" placeholder='Confirm password' {...register('confirmPassword')} 
      className="form-control form-control-lg"/>
      {errors.password && <p>Confirm Password is required</p>}
    </div>
    <div className="form-outline mb-4">
      <label>Bio</label>
      <textarea name="bio" placeholder= {user.bio || 'N/A'}
      className="form-control form-control-lg"
      {...register('bio')} />
    </div>
    <button type="submit" className='updateProfileButton btn btn-primary roounded-pill'>Update Profile</button>
  </form>
  </div>
</div>
</div>
    );
  };

export default editProfileForm;




