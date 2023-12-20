// src/components/ExpenseForm.js
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import './ExpenseForm.css';

const ExpenseForm = () => {
  const [category, setCategory] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Assuming you have user_id and category_id set appropriately
      const newExpense = {
        category,
        payment_method: paymentMethod,
        description,
        amount: parseFloat(amount),
        user_id: 1,
        category_id: 1,
      };

      await axios.post('http://localhost:5000/expenses', newExpense);

      // Redirect to the expense list page after successful submission
      history.push('/expenses');
    } catch (error) {
      console.error('Error submitting expense:', error);
    }
  };

  return (
    <div className="expense-form-container">
      <h2 className="expense-form-heading">Add Expense</h2>
      <form onSubmit={handleSubmit}>
        <label className="expense-form-label">
          Category:
          <select
            className="expense-form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select a category</option>
            <option value="Groceries">Food</option>
            <option value="Transport">Transport</option>
            <option value="Utilities">Utilities</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Grooming">Grooming</option>
            <option value="Health">Health</option>
            {/* Add more categories as needed */}
          </select>
        </label>
        <br />
        <label className="expense-form-label">
          Payment Method:
          <select
            className="expense-form-select"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="">Select a payment method</option>
            <option value="Cash">Cash</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Mpesa">Mpesa</option>
            <option value="Airtel Money">Airtel Money</option>
            {/* Add more payment methods as needed */}
          </select>
        </label>
        <br />
        <label className="expense-form-label">
          Description:
          <input
            className="expense-form-input"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <br />
        <label className="expense-form-label">
          Amount:
          <input
            className="expense-form-input"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </label>
        <br />
        <button className="expense-form-button" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default ExpenseForm;
