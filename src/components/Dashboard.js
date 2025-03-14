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
    <div className="dashboard">
      <h1>Expense Splitter</h1>
      
      {/* Overview Section */}
      <div className="overview">
        <h2>Overview</h2>
        <p><strong>Total Expenses:</strong> ${totalExpenses.toFixed(2)}</p>
        <p><strong>Number of Friends:</strong> {friends.length}</p>
        <h3>Unsettled Balances</h3>
        {unsettledBalances.length > 0 ? (
          <ul>
            {unsettledBalances.map(({ name, balance }, index) => (
              <li key={index}>
                {name}: {balance > 0 ? `is owed $${balance.toFixed(2)}` : `owes $${Math.abs(balance).toFixed(2)}`}
              </li>
            ))}
          </ul>
        ) : (
          <p>All balances are settled!</p>
        )}
      </div>

      {/* Main Sections */}
      <div className="dashboard-sections">
        <section className="friends-section">
          <FriendList friends={friends} setFriends={setFriends} />
        </section>
        <section className="expenses-section">
          <ExpenseList friends={friends} expenses={expenses} setExpenses={setExpenses} />
        </section>
        <section className="summary-section">
          <ExpenseSummary friends={friends} expenses={expenses} />
        </section>
      </div>
    </div>
  );
};

export default Dashboard;