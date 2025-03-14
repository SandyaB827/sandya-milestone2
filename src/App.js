import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import FriendList from './components/FriendList';
import ExpenseList from './components/ExpenseList';
import ExpenseSummary from './components/ExpenseSummary';
import { FriendService } from './services/FriendService';
import { ExpenseService } from './services/ExpenseService';
import './App.css';

function App() {
  const [friends, setFriends] = React.useState(FriendService.getFriends());
  const [expenses, setExpenses] = React.useState(ExpenseService.getExpenses());

  React.useEffect(() => {
    setFriends(FriendService.getFriends());
    setExpenses(ExpenseService.getExpenses());
  }, []);

  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="container-fluid py-4">
          <Routes>
            <Route
              path="/"
              element={<Dashboard friends={friends} expenses={expenses} />}
            />
            <Route
              path="/friends"
              element={<FriendList friends={friends} setFriends={setFriends} />}
            />
            <Route
              path="/expenses"
              element={<ExpenseList friends={friends} expenses={expenses} setExpenses={setExpenses} />}
            />
            <Route
              path="/summary"
              element={<ExpenseSummary friends={friends} expenses={expenses} />}
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;