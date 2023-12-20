import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Link, useHistory, useLocation } from 'react-router-dom';
import ExpenseList from './ExpenseList';
import ExpenseForm from './ExpenseForm';
import Login from './Login';

const Navigation = () => {
  const location = useLocation();
  const isExpenseListRoute = location.pathname === '/expenses';

  return (
    <nav>
      {!isExpenseListRoute && (
        <Link to="/expenses">Expense List</Link>
      )}
    </nav>
  );
};

const App = () => {
  const [user, setUser] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const history = useHistory();

  const handleAddExpense = (newExpense) => {
    setExpenses([...expenses, newExpense]);
    history.push('/expenses');
  };

  return (
    <Router>
      <div>
        {user && <Navigation />}
        
        <Switch>
          <Route path="/" exact>
            {user ? <ExpenseList expenses={expenses} /> : <Login setUser={setUser} />}
          </Route>
          <Route path="/expenses" exact>
            <ExpenseList expenses={expenses} />
          </Route>
          <Route path="/expenses/new">
            <ExpenseForm user_id={user?.user_id} />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default App;
