import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import 'bootstrap/dist/css/bootstrap.min.css';


const registrationForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const router = useRouter();
  const [signupError, setSignupError] = useState(false);

  const onSubmit = async (data: { password: any; confirmPassword: any; }) => {
    const { password, confirmPassword } = data;

    if (password !== confirmPassword) {
      setSignupError(true);
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/users/', data);
      if (response.status === 201) {
        const token = response.data.user.token;
        const idUser = response.data.user.id;
        Cookies.set('id', idUser);
        Cookies.set('token', token);
        router.push('/profile');
      } else {
        setSignupError(true);
      }
    } catch (error) {
      console.error(error);
      setSignupError(true);
    }
  };

  return (
    <div>
      <h1>Sign Up</h1>
      {signupError && <p>Error occurred while signing up</p>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-outline mb-40">
          <label className="form-label">Name</label>
          <input type="text" name="name" {...register('name', { required: true })} />
          {errors.name && <p>Name is required</p>}
        </div>
        <div className="form-outline mb-40">
          <label className="form-label">Email</label>
          <input type="email" name="email" {...register('email', { required: true, pattern: /^\S+@\S+$/i })} />
          {errors.email && <p>Email is required</p>}
        </div>
        <div className="form-outline mb-40">
          <label className="form-label">Password</label>
          <input type="password" name="password" {...register('password', { required: true })} />
          {errors.password && <p>Password is required</p>}
        </div>
        <div className="form-outline mb-40">
          <label className="form-label" >Confirm password</label>
          <input type="password" name="confirmPassword" {...register('confirmPassword', { required: true })} />
          {errors.confirmPassword && <p>Confirm password is required</p>}
          {signupError && <p>Passwords don't match</p>}
        </div>
        <button type="submit" className='registerButton btn btn-primary btn-block mb-4'>Register</button>
      </form>
      <p>
        Already have an account? <a href="/login" className='col'>login</a>
      </p>
    </div>
  );
};

export default registrationForm;
