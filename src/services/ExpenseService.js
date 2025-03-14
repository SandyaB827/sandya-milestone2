export const ExpenseService = {
    expenses: JSON.parse(sessionStorage.getItem('expenses')) || [],
  
    addExpense(description, amount, payerId, participants, date = new Date()) {
      const id = Date.now();
      this.expenses.push({ 
        id, 
        description, 
        amount: parseFloat(amount), 
        payerId, 
        participants, 
        date: date ? new Date(date) : new Date() // Default to current date if not provided
      });
      sessionStorage.setItem('expenses', JSON.stringify(this.expenses));
      return this.expenses;
    },
  
    editExpense(id, updates) {
      const expense = this.expenses.find(e => e.id === id);
      if (expense) {
        Object.assign(expense, updates);
        // Ensure date is converted to Date object if provided
        if (updates.date) expense.date = new Date(updates.date);
      }
      sessionStorage.setItem('expenses', JSON.stringify(this.expenses));
      return this.expenses;
    },
  
    removeExpense(id) {
      this.expenses = this.expenses.filter(e => e.id !== id);
      sessionStorage.setItem('expenses', JSON.stringify(this.expenses));
      return this.expenses;
    },
  
    getExpenses() {
      return this.expenses;
    }
  };