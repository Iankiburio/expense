import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import ExpenseList from './ExpenseList';
import ExpenseForm from './ExpenseForm';
import Login from './Login';

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        // Make a request to your server to check the authentication status
        const response = await axios.get('http://localhost:5000/check-auth', { withCredentials: true });
        // If the server returns a user object, set the user in state
        setUser(response.data.user);
      } catch (error) {
        // Handle errors or redirect to login if authentication fails
        console.error('Authentication check failed:', error);
        setUser(null); // Ensure the user state is null if authentication fails
      }
    };

    checkAuthentication();
  }, []); // The empty dependency array ensures the effect runs only once when the component mounts

  return (
    <Router>
      <div>
        {user && (
          <nav>
            <Link to="/expenses">Expense List</Link>
            <Link to="/expenses/new">Add Expense</Link>
          </nav>
        )}
        
        <Switch>
          <Route path="/" exact>
            {user ? <Redirect to="/expenses" /> : <Login setUser={setUser} />}
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
