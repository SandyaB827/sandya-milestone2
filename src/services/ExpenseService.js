export const ExpenseService = {
    // Initialize expenses from sessionStorage or default to empty array
    expenses: JSON.parse(sessionStorage.getItem('expenses')) || [],
  
    addExpense(description, amount, payerId, participants) {
      const id = Date.now();
      this.expenses.push({ id, description, amount: parseFloat(amount), payerId, participants, date: new Date() });
      sessionStorage.setItem('expenses', JSON.stringify(this.expenses)); // Save to sessionStorage
      return this.expenses;
    },
  
    editExpense(id, updates) {
      const expense = this.expenses.find(e => e.id === id);
      if (expense) Object.assign(expense, updates);
      sessionStorage.setItem('expenses', JSON.stringify(this.expenses)); // Update sessionStorage
      return this.expenses;
    },
  
    removeExpense(id) {
      this.expenses = this.expenses.filter(e => e.id !== id);
      sessionStorage.setItem('expenses', JSON.stringify(this.expenses)); // Update sessionStorage
      return this.expenses;
    },
  
    getExpenses() {
      return this.expenses;
    }
  };