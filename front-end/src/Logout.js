// src/components/Logout.js
import React, { useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

const Logout = ({ setUser }) => {
  useEffect(() => {
    const handleLogout = async () => {
      try {
        await axios.get('http://localhost:5000/logout');
        setUser(null);
      } catch (error) {
        console.error('Error logging out:', error);
      }
    };

    handleLogout();
  }, [setUser]);

  return <Redirect to="/" />;
};

export default Logout;
