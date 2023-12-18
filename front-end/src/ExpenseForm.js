// src/components/ExpenseForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ExpenseForm = () => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:5000/expenses', {
        description,
        amount: parseFloat(amount),
        // Assuming you have user_id and category_id set appropriately
        user_id: 1,
        category_id: 1,
      });

      // Reload the expense list after successful submission
      window.location.reload();
    } catch (error) {
      console.error('Error submitting expense:', error);
    }
  };

  return (
    <div>
      <h2>Add Expense</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Description:
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
        <br />
        <label>
          Amount:
          <input type="text" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ExpenseForm;
