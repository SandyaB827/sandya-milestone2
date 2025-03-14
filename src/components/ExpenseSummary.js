import React from 'react';
import { CalculationService } from '../services/CalculationService';
import './ExpenseSummary.css';

const ExpenseSummary = ({ friends, expenses }) => {
  const total = CalculationService.calculateTotal(expenses);
  const balances = CalculationService.calculateSplit(expenses, friends);

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h2 className="card-title">Summary</h2>
        <p className="card-text"><strong>Total Expenses:</strong> ₹{total.toFixed(2)}</p>
        <h3>Balances</h3>
        <ul className="list-group list-group-flush">
          {friends.map(friend => {
            const balance = balances[friend.id] || 0;
            return (
              <li key={friend.id} className="list-group-item d-flex justify-content-between align-items-center">
                <span>{friend.name}:</span>
                <span className={balance > 0 ? 'text-success' : balance < 0 ? 'text-danger' : 'text-muted'}>
                  {balance > 0 ? `is owed ₹${balance.toFixed(2)}` : balance < 0 ? `owes ₹${Math.abs(balance).toFixed(2)}` : 'is settled'}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default ExpenseSummary;