import React, { useState } from 'react';
import { ExpenseService } from '../services/ExpenseService';
import './ExpenseList.css';

const ExpenseList = ({ friends, expenses, setExpenses }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [payerId, setPayerId] = useState('');
  const [participants, setParticipants] = useState([]);
  const [date, setDate] = useState('');
  const [editId, setEditId] = useState(null);
  const [editDescription, setEditDescription] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editPayerId, setEditPayerId] = useState('');
  const [editParticipants, setEditParticipants] = useState([]);
  const [editDate, setEditDate] = useState('');

  const addExpense = () => {
    if (!description || !amount || !payerId || participants.length === 0) return;
    const updatedExpenses = ExpenseService.addExpense(
      description,
      amount,
      Number(payerId), // Ensure payerId is a number
      participants.map(Number), // Ensure participant IDs are numbers
      date
    );
    setExpenses([...updatedExpenses]);
    resetForm();
  };

  const removeExpense = (id) => {
    const updatedExpenses = ExpenseService.removeExpense(id);
    setExpenses([...updatedExpenses]);
  };

  const startEditing = (expense) => {
    setEditId(expense.id);
    setEditDescription(expense.description);
    setEditAmount(expense.amount);
    setEditPayerId(String(expense.payerId)); // Convert to string for select
    setEditParticipants(expense.participants.map(String)); // Convert to strings for select
    setEditDate(expense.date.toISOString().split('T')[0]);
  };

  const saveEdit = (id) => {
    if (!editDescription || !editAmount || !editPayerId || editParticipants.length === 0) return;
    const updates = {
      description: editDescription,
      amount: parseFloat(editAmount),
      payerId: Number(editPayerId), // Ensure number
      participants: editParticipants.map(Number), // Ensure numbers
      date: editDate
    };
    const updatedExpenses = ExpenseService.editExpense(id, updates);
    setExpenses([...updatedExpenses]);
    resetEditForm();
  };

  const cancelEdit = () => {
    resetEditForm();
  };

  const resetForm = () => {
    setDescription('');
    setAmount('');
    setPayerId('');
    setParticipants([]);
    setDate('');
  };

  const resetEditForm = () => {
    setEditId(null);
    setEditDescription('');
    setEditAmount('');
    setEditPayerId('');
    setEditParticipants([]);
    setEditDate('');
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
        {friends.map(f => (
          <option key={f.id} value={f.id}>
            {f.name}
          </option>
        ))}
      </select>
      <select
        multiple
        value={participants}
        onChange={(e) => setParticipants([...e.target.selectedOptions].map(o => o.value))}
      >
        {friends.map(f => (
          <option key={f.id} value={f.id}>
            {f.name}
          </option>
        ))}
      </select>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        placeholder="Date"
      />
      <button onClick={addExpense}>Add Expense</button>

      <ul>
        {expenses.map(exp => (
          <li key={exp.id}>
            {editId === exp.id ? (
              <>
                <input
                  type="text"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Description"
                />
                <input
                  type="number"
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                  placeholder="Amount"
                />
                <select
                  value={editPayerId}
                  onChange={(e) => setEditPayerId(e.target.value)}
                >
                  <option value="">Select Payer</option>
                  {friends.map(f => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
                <select
                  multiple
                  value={editParticipants}
                  onChange={(e) => setEditParticipants([...e.target.selectedOptions].map(o => o.value))}
                >
                  {friends.map(f => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
                <input
                  type="date"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                />
                <button onClick={() => saveEdit(exp.id)}>Save</button>
                <button onClick={cancelEdit}>Cancel</button>
              </>
            ) : (
              <>
                {exp.description} - ${exp.amount} (Paid by: {friends.find(f => f.id === exp.payerId)?.name || 'Unknown'}, 
                Participants: {exp.participants
                  .map(id => friends.find(f => f.id === id)?.name || 'Unknown')
                  .join(', ')}, 
                Date: {new Date(exp.date).toLocaleDateString()})
                <button onClick={() => startEditing(exp)}>Edit</button>
                <button onClick={() => removeExpense(exp.id)}>Remove</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExpenseList;