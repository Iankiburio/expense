// src/components/Login.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Login.css';
import logo from './logo.png';

const Login = ({ setUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/login', {
        username,
        password,
      });

      setUser(response.data);
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <section className="login-page">
      <div className="container">
        <div className="login-form">
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
              <button type="submit">Login</button>
            </div>
          </form>

          {/* Button to go to the register form */}
          <p>
            Don't have an account?{' '}
            <Link to="/register">
              <button type="button">Sign up</button>
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;
