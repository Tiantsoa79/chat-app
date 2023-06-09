import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import 'bootstrap/dist/css/bootstrap.min.css';
import Channels from '@/components/Channels';
import Users from '@/components/Users';

const Navbar = () => {
  const router = useRouter();
  const [showChannels, setShowChannels] = useState(false);
  const [showUsers, setShowUsers] = useState(false);

  const handleLoginClick = () => {
    const token = Cookies.get('token');
    
    if (token) {
      router.push('/profile');
    } else {
      router.push('/login');
    }
  };

  const handleProfileClick = () => {
    const token = Cookies.get('token');
    
    if (token) {
      router.push('/profile');
    } else {
      router.push('/login');
    }
  };

  const handleLogout = () => {
    // Supprimer le cookie "token"
    Cookies.remove('token');
    Cookies.remove('recipient');

    // Rediriger vers la page de connexion
    router.push('/login');
  };

  const handleToggleChannels = () => {
    const token = Cookies.get('token');
    
    if (token) {
      setShowChannels(!showChannels);
    } else {
      router.push('/login');
    }
        
  };

  
  const handleToggleUsers = () => {
    const token = Cookies.get('token');
    
    if (token) {
      setShowUsers(!showUsers);
    } else {
      router.push('/login');
    }
        
  };
    
  const handleCreateChannel = () => {
    const token = Cookies.get('token');
    
    if (token) {
      router.push('/channel/create');
    } else {
      router.push('/login');
    }
        
  };

  const handleSignupClick = () => {
    const token = Cookies.get('token');
    
    if (token) {
      router.push('/profile');
    } else {
      router.push('/sign-up');
    }
        
  };
  
  return (
    <div className='bg-light h-100'>
    <div className="vertical-navbar p-3 d-flex flex-column justify-content-start align-items-start">
    <button onClick={handleLoginClick} className="btn btn-outline-primary rounded-pill mb-3">Login</button>
    <button onClick={handleSignupClick} className="btn btn-outline-primary rounded-pill mb-3">Sign up</button>
    <button onClick={handleProfileClick} className="btn btn-outline-primary rounded-pill mb-3">Profile</button>
    <button onClick={handleToggleChannels} className="btn btn-outline-primary rounded-pill mb-3">
      {showChannels ? 'Hide Channels' : 'Show Channels'}
    </button>
    {showChannels && <Channels/> }
    {<button onClick={handleCreateChannel} className="btn btn-outline-primary rounded-pill mb-3">create channel</button>}
    <button onClick={handleToggleUsers} className="btn btn-outline-primary rounded-pill mb-3">
      {showUsers ? 'Hide users' : 'Show users'}
    </button>
    {showUsers && <Users/> }
    <button onClick={handleLogout} className="logoutButton btn btn-outline-dark rounded-pill">Lougout</button> {/* Bouton de déconnexion */}
    </div>
  </div>
    // <div className="vertical-navbar">
    //   <button onClick={handleLoginClick}>Login</button>o
    //   <button onClick={handleProfileClick}>Profile</button>
    //   <button onClick={handleToggleChannels}>
    //       {showChannels ? 'Hide Channels' : 'Show Channels'}
    //    </button>
    //      {showChannels && <ChannelsPage />}
    //   <button onClick={handleLogout}>Déconnexion</button> {/* Bouton de déconnexion */}
    // </div>
  );
};

export default Navbar;
