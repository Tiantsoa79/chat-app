import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie'; 
import 'bootstrap/dist/css/bootstrap.min.css';


const loginForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const router = useRouter();
  const [loginError, setLoginError] = useState(false);

  const onSubmit = async (data: any) => {
    try {
      const response = await axios.post('http://localhost:8080/users/login', data);
      if (response.status === 200) {
        const token = response.data.user.token;
        //id
        const idUser = response.data.user.id;
        Cookies.set('id', idUser);
        
        // Stocker le jeton dans un cookie
        Cookies.set('token', token);

        // Authentifié, redirection vers la page de profil
        router.push('/profile');
      } else {
        setLoginError(true);
      }
    } catch (error) {
      console.error(error);
      setLoginError(true);
    }
  };

  return (
    <div className="vh-100">
    <div className="container-fluid h-custom">
      <div className="row d-flex justify-content-center align-items-center h-100">
        <div className="col-md-9 col-lg-6 col-xl-5">
          <img src="/login.avif" className="img-fluid" alt="Sample image" />
        </div>
        <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
          <h1>Login</h1>
          {loginError && <p>Incorrect email or password</p>}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-outline mb-4">
              <input
                type="email"
                name="email"
                className="form-control form-control-lg"
                placeholder="Email address"
                {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
              />
              {errors.email && <p>Email is required</p>}
            </div>
            <div className="form-outline mb-4">
              <input
                type="password"
                name="password"
                className="form-control form-control-lg"
                placeholder="Password"
                {...register('password', { required: true })}
              />
              {errors.password && <p>Password is required</p>}
            </div>
            <button type="submit" className="loginButton btn btn-primary btn-block mb-4">
              Login
            </button>
          </form>
          <p>
            Don't have an account? <a href="/sign-up">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  </div>
  
  );
};

export default loginForm;
