export const CalculationService = {
    calculateTotal(expenses) {
      return expenses.reduce((sum, exp) => sum + exp.amount, 0);
    },
  
    calculateSplit(expenses, friends) {
      const balances = {};
      friends.forEach(f => (balances[f.id] = 0));
  
      expenses.forEach(exp => {
        const { amount, payerId, participants, splitType = 'equal', customSplits = {} } = exp;
  
        if (splitType === 'equal') {
          // Equal split logic (existing)
          const splitAmount = amount / participants.length;
          balances[payerId] += amount; // Credit payer
          participants.forEach(participantId => {
            balances[participantId] -= splitAmount; // Debit each participant
          });
        } else if (splitType === 'custom') {
          // Custom split logic (percentage or share-based)
          balances[payerId] += amount; // Credit payer full amount
          let totalAssigned = 0;
  
          // Calculate based on customSplits (e.g., { friendId: percentage })
          participants.forEach(participantId => {
            const share = customSplits[participantId] || 0; // Percentage (0-100)
            const participantAmount = (share / 100) * amount;
            balances[participantId] -= participantAmount;
            totalAssigned += participantAmount;
          });
  
          // Ensure total matches expense amount (adjust payer if needed)
          const discrepancy = amount - totalAssigned;
          if (discrepancy !== 0) balances[payerId] -= discrepancy; // Adjust payer’s balance
        }
      });
  
      return balances;
    }
  };