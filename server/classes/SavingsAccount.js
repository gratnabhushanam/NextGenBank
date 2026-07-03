const Account = require('./Account');

/**
 * Savings Account Class
 * Demonstrates Inheritance and Method Overriding (Polymorphism)
 */
class SavingsAccount extends Account {
  #withdrawalLimit;
  #interestRate;

  constructor(accountNumber, accountHolderName, email, phone, initialBalance, branch, ifsc, interestRate = 4.0, withdrawalLimit = 50000) {
    // Inheritance: Call parent constructor
    super(accountNumber, accountHolderName, email, phone, initialBalance, 'Savings', branch, ifsc);
    this.#withdrawalLimit = withdrawalLimit;
    this.#interestRate = interestRate;
  }

  // Polymorphism: Overriding the withdraw method
  withdraw(amount) {
    if (amount <= 0) {
      throw new Error("Withdrawal amount must be greater than zero.");
    }
    
    if (amount > this.#withdrawalLimit) {
      throw new Error(`Withdrawal amount exceeds the daily limit of ${this.#withdrawalLimit}.`);
    }

    const currentBalance = super.getBalance();
    if (amount > currentBalance) {
      throw new Error("Insufficient funds.");
    }

    // Use protected setter to update balance
    super._setBalance(currentBalance - amount);
    
    super._addTransaction({
      type: "Withdrawal",
      amount: amount,
      date: new Date(),
      description: "Savings Account Withdrawal"
    });

    return super.getBalance();
  }

  // Polymorphism: Overriding the calculateInterest method
  // Savings accounts typically use Simple Interest: (P * R * T) / 100
  // For demonstration, we assume T = 1 year.
  calculateInterest() {
    const principal = super.getBalance();
    const interest = (principal * this.#interestRate * 1) / 100;
    
    super._setBalance(principal + interest);
    
    super._addTransaction({
      type: "Interest Credit",
      amount: interest,
      date: new Date(),
      description: `Simple Interest added at ${this.#interestRate}%`
    });

    return interest;
  }
}

module.exports = SavingsAccount;
