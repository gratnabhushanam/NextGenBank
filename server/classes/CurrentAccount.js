const Account = require('./Account');

/**
 * Current Account Class
 * Demonstrates Inheritance and Method Overriding (Polymorphism)
 */
class CurrentAccount extends Account {
  #overdraftLimit;

  constructor(accountNumber, accountHolderName, email, phone, initialBalance, branch, ifsc, overdraftLimit = 10000) {
    super(accountNumber, accountHolderName, email, phone, initialBalance, 'Current', branch, ifsc);
    this.#overdraftLimit = overdraftLimit;
  }

  // Polymorphism: Overriding the withdraw method
  // Current accounts allow overdraft up to a certain limit.
  withdraw(amount) {
    if (amount <= 0) {
      throw new Error("Withdrawal amount must be greater than zero.");
    }

    const currentBalance = super.getBalance();
    
    if (currentBalance - amount < -this.#overdraftLimit) {
      throw new Error(`Overdraft limit of ${this.#overdraftLimit} exceeded.`);
    }

    // Override validation to allow negative balance
    // So we manually set the private property logic here or bypass _setBalance if it prevents negatives.
    // We update _setBalance in Account to allow negative for Current Accounts, or we handle it via a specific setter.
    // In Account.js, _setBalance throws if < 0. Let's create a custom setter for CurrentAccount or override _setBalance.
    
    // Instead, CurrentAccount specific _setBalance
    this._setCurrentBalance(currentBalance - amount);
    
    super._addTransaction({
      type: "Withdrawal",
      amount: amount,
      date: new Date(),
      description: "Current Account Withdrawal"
    });

    return super.getBalance();
  }

  // Custom setter to bypass base class non-negative validation
  _setCurrentBalance(newBalance) {
    // Current accounts can have negative balances up to the overdraft limit
    if (newBalance < -this.#overdraftLimit) {
      throw new Error("Balance exceeds overdraft limit.");
    }
    // Access the base class private state via a dirty trick or modify the base class.
    // In strict ES6 private fields, subclasses cannot access `#balance`. 
    // They must use the provided protected methods. 
    // Let's modify Account._setBalance to accept negative values if a flag is passed, or just update the base class.
    // Wait, in JS, `#balance` is strictly private to `Account`. 
    // To allow negative balance, we need to modify `Account._setBalance` to not throw, OR provide `_setBalanceUnsafe`.
    
    // For now, let's call a method we will add to Account.js: `_setBalanceOverdraft(newBalance)`
    super._setBalanceOverdraft(newBalance);
  }

  // Polymorphism: Overriding the calculateInterest method
  // Current accounts do not earn interest.
  calculateInterest() {
    // No interest for current accounts
    return 0;
  }
}

module.exports = CurrentAccount;
