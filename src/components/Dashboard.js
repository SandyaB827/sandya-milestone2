import React from 'react';
import { CalculationService } from '../services/CalculationService';
import './Dashboard.css';

const Dashboard = ({ friends, expenses }) => {
  const totalExpenses = CalculationService.calculateTotal(expenses);
  const balances = CalculationService.calculateSplit(expenses, friends);
  const unsettledBalances = Object.entries(balances)
    .filter(([_, balance]) => balance !== 0)
    .map(([id, balance]) => ({
      name: friends.find(f => f.id === Number(id))?.name || 'Unknown',
      balance
    }));

  return (
    <div className="dashboard">
      <h1 className="text-center mb-4">Expense Splitter Dashboard</h1>
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h2 className="card-title">Overview</h2>
          <p className="card-text"><strong>Total Expenses:</strong> ₹{totalExpenses.toFixed(2)}</p>
          <p className="card-text"><strong>Number of Friends:</strong> {friends.length}</p>
          <h3>Unsettled Balances</h3>
          {unsettledBalances.length > 0 ? (
            <ul className="list-group list-group-flush">
              {unsettledBalances.map(({ name, balance }, index) => (
                <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                  <span>{name}:</span>
                  <span className={balance > 0 ? 'text-success' : 'text-danger'}>
                    {balance > 0 ? `is owed ₹${balance.toFixed(2)}` : `owes ₹${Math.abs(balance).toFixed(2)}`}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted">All balances are settled!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;