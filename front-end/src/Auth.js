// src/components/Auth.js
import React from 'react';
import { Route, Switch, Link, Redirect } from 'react-router-dom';
import Login from './Login';
import Register from './Register';

const Auth = ({ setUser }) => {
  return (
    <div>
      <nav>
        <Link to="/auth/login">Login</Link>
        <Link to="/auth/register">Register</Link>
      </nav>
      
      <Switch>
        <Route path="/auth/login">
          <Login setUser={setUser} />
        </Route>
        <Route path="/auth/register">
          <Register setUser={setUser} />
        </Route>
        <Redirect from="/auth" to="/auth/login" />
      </Switch>
    </div>
  );
};

export default Auth;
