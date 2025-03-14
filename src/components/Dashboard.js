import React, { useState, useEffect } from 'react';
import FriendList from './FriendList';
import ExpenseList from './ExpenseList';
import ExpenseSummary from './ExpenseSummary';
import { FriendService } from '../services/FriendService';
import { ExpenseService } from '../services/ExpenseService';
import './Dashboard.css';

const Dashboard = () => {
  const [friends, setFriends] = useState(FriendService.getFriends());
  const [expenses, setExpenses] = useState(ExpenseService.getExpenses());

  // Sync with sessionStorage on mount
  useEffect(() => {
    setFriends(FriendService.getFriends());
    setExpenses(ExpenseService.getExpenses());
  }, []);

  return (
    <div className="dashboard">
      <h1>Expense Splitter</h1>
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