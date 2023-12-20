// Login.js

import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import './Login.css';
import Logo from './logo.png';

const Login = ({ setUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/login', {
        username,
        password,
      });

      setUser(response.data);

      // Redirect to the expenses list
      history.push('/expenses');
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <section className="login">
      <div className="login__container">
        <img src={Logo} alt="Logo" className="login__logo" />

        <div className="login__form">
          <form onSubmit={handleSubmit}>
            <div className="login__form-group">
              <label htmlFor="username" className="login__label">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="login__input"
              />
            </div>
            <div className="login__form-group">
              <label htmlFor="password" className="login__label">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="login__input"
              />
            </div>
            <div className="login__form-group">
              <button type="submit" className="login__button">
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;
