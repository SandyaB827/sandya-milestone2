import React, { useState, useEffect } from 'react';
import FriendList from './FriendList';
import ExpenseList from './ExpenseList';
import ExpenseSummary from './ExpenseSummary';
import { FriendService } from '../services/FriendService';
import { ExpenseService } from '../services/ExpenseService';
import { CalculationService } from '../services/CalculationService';
import './Dashboard.css';

const Dashboard = () => {
  const [friends, setFriends] = useState(FriendService.getFriends());
  const [expenses, setExpenses] = useState(ExpenseService.getExpenses());

  useEffect(() => {
    setFriends(FriendService.getFriends());
    setExpenses(ExpenseService.getExpenses());
  }, []);

  const totalExpenses = CalculationService.calculateTotal(expenses);
  const balances = CalculationService.calculateSplit(expenses, friends);
  const unsettledBalances = Object.entries(balances)
    .filter(([_, balance]) => balance !== 0)
    .map(([id, balance]) => ({
      name: friends.find(f => f.id === Number(id))?.name || 'Unknown',
      balance
    }));

  return (
    <div className="dashboard container-fluid py-4">
      <h1 className="text-center mb-4">Expense Splitter</h1>

      {/* Overview Section */}
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

      {/* Main Sections */}
      <div className="row">
        <div className="col-md-4 mb-4">
          <FriendList friends={friends} setFriends={setFriends} />
        </div>
        <div className="col-md-4 mb-4">
          <ExpenseList friends={friends} expenses={expenses} setExpenses={setExpenses} />
        </div>
        <div className="col-md-4 mb-4">
          <ExpenseSummary friends={friends} expenses={expenses} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;