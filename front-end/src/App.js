// src/components/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Link, Redirect } from 'react-router-dom';
import axios from 'axios'; // Import axios if you plan to use it later
import ExpenseList from './ExpenseList';
import ExpenseForm from './ExpenseForm';
import Login from './Login';
import Register from './Register'; // Import the Register component
import Logout from './Logout'; // Import the Logout component

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch user info or check authentication status here
    // ...

  }, []);

  return (
    <Router>
      <div>
        {user && (
          <nav>
            <Link to="/expenses">Expense List</Link>
            <Link to="/expenses/new">Add Expense</Link>
            <Link to="/logout">Logout</Link>
          </nav>
        )}
        
        <Switch>
          <Route path="/" exact>
            {user ? <Redirect to="/expenses" /> : <Login setUser={setUser} />}
          </Route>
          <Route path="/register">
            <Register />
          </Route>
          <Route path="/logout">
            <Logout setUser={setUser} />
          </Route>
          <Route path="/expenses" exact>
            {user ? <ExpenseList /> : <Redirect to="/login" />}
          </Route>
          <Route path="/expenses/new">
            {user ? <ExpenseForm /> : <Redirect to="/login" />}
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default App;
