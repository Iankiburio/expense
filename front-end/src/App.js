import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Link, useHistory } from 'react-router-dom';
import ExpenseList from './ExpenseList';
import ExpenseForm from './ExpenseForm';
import Login from './Login';

const App = () => {
  const [user, setUser] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const history = useHistory();

  const handleAddExpense = (newExpense) => {
    // Assuming newExpense is an object with 'description' and 'amount' properties
    setExpenses([...expenses, newExpense]);

    // Redirect to ExpenseList after adding the expense
    history.push('/expenses');
  };

  return (
    <Router>
      <div>
        {user && (
          <nav>
            <Link to="/expenses">Expense List</Link>
          </nav>
        )}
        
        <Switch>
          <Route path="/" exact>
            {user ? <ExpenseList expenses={expenses} /> : <Login setUser={setUser} />}
          </Route>
          <Route path="/expenses" exact>
            <ExpenseList expenses={expenses} />
          </Route>
          <Route path="/expenses/new">
            <ExpenseForm onAddExpense={handleAddExpense} />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default App;
