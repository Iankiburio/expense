// src/components/Register.js
import React, { useState } from 'react';
import axios from 'axios';
import './Register.css';import logo from './logo.png';


const Register = ({ setUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log('Sending registration request with data:', { username, password });
      // Update the endpoint to match your server's registration endpoint
      const response = await axios.post('http://localhost:5000/register', {
        username,
        password,
      });

      setUser(response.data);
    } catch (error) {
      console.error('Error registering:', error);
    }
  };

  return (
    <section className="register-page">
      <div className="container">
        <div className="register-form">
        <img src={logo} alt="" className="logo"/>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <button type="submit">Register</button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Register;
