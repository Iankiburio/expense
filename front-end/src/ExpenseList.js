import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './ExpenseList.css';

const ExpenseList = () => {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/expenses');
        setExpenses(response.data);
      } catch (error) {
        console.error('Error fetching expenses:', error);
      }
    };

    fetchExpenses();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/expenses/${id}`);
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  const totalExpense = expenses.reduce((total, expense) => total + expense.amount, 0);

  // Function to handle logout
  const handleLogout = () => {
    window.location.href = "/"; 
  };

  return (
    <div className="containers">
      <h2>Expense List</h2>
      <ul>
        {expenses.map((expense) => (
          <li key={expense.id}>
            {expense.category} - {expense.description} - {expense.amount}Kshs - {new Date(expense.date_added).toLocaleDateString()}
            <button onClick={() => handleDelete(expense.id)}>Delete</button>
          </li>
        ))}
      </ul>

      {/* Button to navigate to the expense form */}
      <Link to="/expenses/new" className="link-button">
        <button>Add Expense</button>
      </Link>

      {/* Logout button */}
      <button onClick={handleLogout}>Logout</button>

      <p>Total Expense: {totalExpense}Kshs</p>
    </div>
  );
};

export default ExpenseList;
