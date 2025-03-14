import React from 'react';
import { CalculationService } from '../services/CalculationService';
import './ExpenseSummary.css';

const ExpenseSummary = ({ friends, expenses }) => {
  const total = CalculationService.calculateTotal(expenses);
  const balances = CalculationService.calculateSplit(expenses, friends);

  return (
    <div className="expense-summary">
      <h2>Summary</h2>
      <p>Total Expenses: ${total.toFixed(2)}</p>
      <h3>Balances</h3>
      <ul>
        {Object.entries(balances).map(([id, balance]) => (
          <li key={id}>
            {friends.find(f => f.id === parseInt(id))?.name}: {balance > 0 ? `is owed $${balance.toFixed(2)}` : `owes $${Math.abs(balance).toFixed(2)}`}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExpenseSummary;