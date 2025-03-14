export const CalculationService = {
    calculateTotal(expenses) {
      return expenses.reduce((sum, exp) => sum + exp.amount, 0);
    },
  
    calculateSplit(expenses, friends) {
      const balances = {};
      friends.forEach(f => (balances[f.id] = 0));
  
      expenses.forEach(exp => {
        const splitAmount = exp.amount / exp.participants.length; // Equal split per person
        // Credit the payer the full amount they paid
        balances[exp.payerId] += exp.amount;
        // Debit each participant their share, including the payer if they’re in participants
        exp.participants.forEach(participantId => {
          balances[participantId] -= splitAmount;
        });
      });
  
      return balances;
    }
  };