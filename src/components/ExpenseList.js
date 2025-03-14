import React, { useState } from 'react';
import { ExpenseService } from '../services/ExpenseService';
import './ExpenseList.css';

const ExpenseList = ({ friends, expenses, setExpenses }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [payerId, setPayerId] = useState('');
  const [participants, setParticipants] = useState([]);
  const [date, setDate] = useState('');
  const [splitType, setSplitType] = useState('equal');
  const [customSplits, setCustomSplits] = useState({});
  const [editId, setEditId] = useState(null);
  const [editDescription, setEditDescription] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editPayerId, setEditPayerId] = useState('');
  const [editParticipants, setEditParticipants] = useState([]);
  const [editDate, setEditDate] = useState('');
  const [editSplitType, setEditSplitType] = useState('equal');
  const [editCustomSplits, setEditCustomSplits] = useState({});

  const addExpense = () => {
    if (!description || !amount || !payerId || participants.length === 0) return;
    if (splitType === 'custom' && Object.keys(customSplits).length === 0) return;
    const updatedExpenses = ExpenseService.addExpense(
      description,
      amount,
      Number(payerId),
      participants.map(Number),
      date,
      splitType,
      splitType === 'custom' ? customSplits : {}
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
    setEditPayerId(String(expense.payerId));
    setEditParticipants(expense.participants.map(String));
    setEditDate(expense.date.toISOString().split('T')[0]);
    setEditSplitType(expense.splitType || 'equal');
    setEditCustomSplits(expense.customSplits || {});
  };

  const saveEdit = (id) => {
    if (!editDescription || !editAmount || !editPayerId || editParticipants.length === 0) return;
    if (editSplitType === 'custom' && Object.keys(editCustomSplits).length === 0) return;
    const updates = {
      description: editDescription,
      amount: parseFloat(editAmount),
      payerId: Number(editPayerId),
      participants: editParticipants.map(Number),
      date: editDate,
      splitType: editSplitType,
      customSplits: editSplitType === 'custom' ? editCustomSplits : {}
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
    setSplitType('equal');
    setCustomSplits({});
  };

  const resetEditForm = () => {
    setEditId(null);
    setEditDescription('');
    setEditAmount('');
    setEditPayerId('');
    setEditParticipants([]);
    setEditDate('');
    setEditSplitType('equal');
    setEditCustomSplits({});
  };

  const updateCustomSplit = (friendId, value) => {
    setCustomSplits(prev => ({
      ...prev,
      [friendId]: parseFloat(value) || 0
    }));
  };

  const updateEditCustomSplit = (friendId, value) => {
    setEditCustomSplits(prev => ({
      ...prev,
      [friendId]: parseFloat(value) || 0
    }));
  };

  return (
    <div className="expense-list">
      <h2>Expenses</h2>
      <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
      <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" />
      <select value={payerId} onChange={(e) => setPayerId(e.target.value)}>
        <option value="">Select Payer</option>
        {friends.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
      </select>
      <select multiple value={participants} onChange={(e) => setParticipants([...e.target.selectedOptions].map(o => o.value))}>
        {friends.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
      </select>
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} placeholder="Date" />
      <select value={splitType} onChange={(e) => setSplitType(e.target.value)}>
        <option value="equal">Equal Split</option>
        <option value="custom">Custom Split</option>
      </select>
      {splitType === 'custom' && participants.length > 0 && (
        <div className="custom-splits">
          <h4>Custom Percentages (%)</h4>
          {participants.map(id => (
            <div key={id}>
              <label>{friends.find(f => f.id === Number(id))?.name || 'Unknown'}: </label>
              <input
                type="number"
                min="0"
                max="100"
                value={customSplits[id] || ''}
                onChange={(e) => updateCustomSplit(id, e.target.value)}
                placeholder="Percentage"
              />
            </div>
          ))}
        </div>
      )}
      <button onClick={addExpense}>Add Expense</button>

      <ul>
        {expenses.map(exp => (
          <li key={exp.id}>
            {editId === exp.id ? (
              <>
                <input type="text" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} placeholder="Description" />
                <input type="number" value={editAmount} onChange={(e) => setEditAmount(e.target.value)} placeholder="Amount" />
                <select value={editPayerId} onChange={(e) => setEditPayerId(e.target.value)}>
                  <option value="">Select Payer</option>
                  {friends.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                </select>
                <select multiple value={editParticipants} onChange={(e) => setEditParticipants([...e.target.selectedOptions].map(o => o.value))}>
                  {friends.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                </select>
                <input type="date" value={editDate} onChange={(e) => setEditDate(e.target.value)} />
                <select value={editSplitType} onChange={(e) => setEditSplitType(e.target.value)}>
                  <option value="equal">Equal Split</option>
                  <option value="custom">Custom Split</option>
                </select>
                {editSplitType === 'custom' && editParticipants.length > 0 && (
                  <div className="custom-splits">
                    <h4>Custom Percentages (%)</h4>
                    {editParticipants.map(id => (
                      <div key={id}>
                        <label>{friends.find(f => f.id === Number(id))?.name || 'Unknown'}: </label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={editCustomSplits[id] || ''}
                          onChange={(e) => updateEditCustomSplit(id, e.target.value)}
                          placeholder="Percentage"
                        />
                      </div>
                    ))}
                  </div>
                )}
                <button onClick={() => saveEdit(exp.id)}>Save</button>
                <button onClick={cancelEdit}>Cancel</button>
              </>
            ) : (
              <>
                {exp.description} - ${exp.amount} (Paid by: {friends.find(f => f.id === exp.payerId)?.name || 'Unknown'}, 
                Participants: {exp.participants.map(id => friends.find(f => f.id === id)?.name || 'Unknown').join(', ')}, 
                Date: {new Date(exp.date).toLocaleDateString()},
                Split: {exp.splitType === 'custom' 
                  ? `Custom (${Object.entries(exp.customSplits)
                      .map(([id, pct]) => `${friends.find(f => f.id === Number(id))?.name || 'Unknown'}: ${pct}%`)
                      .join(', ')})`
                  : 'Equal'})
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