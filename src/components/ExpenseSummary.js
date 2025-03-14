import React from 'react';
import { CalculationService } from '../services/CalculationService';
import './ExpenseSummary.css';

const ExpenseSummary = ({ friends, expenses }) => {
  const total = CalculationService.calculateTotal(expenses);
  const balances = CalculationService.calculateSplit(expenses, friends);

  return (
    <div className="expense-summary">
      <h2>Summary</h2>
      <p><strong>Total Expenses:</strong> ${total.toFixed(2)}</p>
      <h3>Balances</h3>
      <ul>
        {friends.map(friend => {
          const balance = balances[friend.id] || 0;
          return (
            <li key={friend.id}>
              {friend.name}: {balance > 0 ? `is owed $${balance.toFixed(2)}` : balance < 0 ? `owes $${Math.abs(balance).toFixed(2)}` : 'is settled'}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ExpenseSummary;