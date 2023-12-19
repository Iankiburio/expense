// src/components/ExpenseList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

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
      // Optionally: Fetch the updated list of expenses and update the state
      // const response = await axios.get('http://localhost:5000/expenses');
      // setExpenses(response.data);
    } catch (error) {
      console.error('Error deleting expense:', error);

    }
  };

  const totalExpense = expenses.reduce((total,expense) => total+ expense.amount, 0)

  return (
    <div>
      <h2>Expense List</h2>
      <ul>
        {expenses.map((expense) => (
          <li key={expense.id}>
            {expense.description} - ${expense.amount} - {new Date(expense.date_added).toLocaleDateString()}
            <button onClick={() => handleDelete(expense.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <p>Total Expense: ${totalExpense}</p>

      {/* Button to navigate to the expense form */}
      <Link to="/expenses/new">
        <button>Add Expense</button>
      </Link>
    </div>
  );
};

export default ExpenseList;
