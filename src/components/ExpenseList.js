import React, { useState } from 'react';
import { ExpenseService } from '../services/ExpenseService';
import './ExpenseList.css';

const ExpenseList = ({ friends, expenses, setExpenses }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [payerId, setPayerId] = useState('');
  const [participants, setParticipants] = useState([]);

  const addExpense = () => {
    if (!description || !amount || !payerId || participants.length === 0) return;
    const updatedExpenses = ExpenseService.addExpense(description, amount, payerId, participants);
    setExpenses([...updatedExpenses]); // Trigger re-render with new array
    setDescription('');
    setAmount('');
    setPayerId('');
    setParticipants([]);
  };

  const removeExpense = (id) => {
    const updatedExpenses = ExpenseService.removeExpense(id);
    setExpenses([...updatedExpenses]); // Trigger re-render with new array
  };

  return (
    <div className="expense-list">
      <h2>Expenses</h2>
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
      />
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
      />
      <select value={payerId} onChange={(e) => setPayerId(e.target.value)}>
        <option value="">Select Payer</option>
        {friends.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
      </select>
      <select multiple value={participants} onChange={(e) => setParticipants([...e.target.selectedOptions].map(o => o.value))}>
        {friends.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
      </select>
      <button onClick={addExpense}>Add Expense</button>
      <ul>
        {expenses.map(exp => (
          <li key={exp.id}>
            {exp.description} - ${exp.amount} (Paid by: {friends.find(f => f.id === exp.payerId)?.name})
            <button onClick={() => removeExpense(exp.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExpenseList;