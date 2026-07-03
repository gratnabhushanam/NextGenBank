const Account = require('./Account');

/**
 * Fixed Deposit Account Class
 * Demonstrates Inheritance and Method Overriding (Polymorphism)
 */
class FixedDepositAccount extends Account {
  #lockInPeriod; // in months
  #penaltyPercentage;
  #interestRate;
  #createdAt;

  constructor(accountNumber, accountHolderName, email, phone, initialBalance, branch, ifsc, lockInPeriod = 12, penaltyPercentage = 2.0, interestRate = 7.0) {
    super(accountNumber, accountHolderName, email, phone, initialBalance, 'FixedDeposit', branch, ifsc);
    this.#lockInPeriod = lockInPeriod; // in months
    this.#interestRate = interestRate;
    this.#penaltyPercentage = penaltyPercentage;
    this.#createdAt = new Date();
  }

  // Polymorphism: Overriding the withdraw method
  withdraw(amount) {
    if (amount <= 0) {
      throw new Error("Withdrawal amount must be greater than zero.");
    }

    const currentBalance = super.getBalance();
    if (amount > currentBalance) {
      throw new Error("Insufficient funds for Fixed Deposit withdrawal.");
    }

    // Check for premature withdrawal
    const currentDate = new Date();
    const monthsElapsed = (currentDate.getFullYear() - this.#createdAt.getFullYear()) * 12 + (currentDate.getMonth() - this.#createdAt.getMonth());
    
    let amountToDeduct = amount;
    
    if (monthsElapsed < this.#lockInPeriod) {
      // Premature withdrawal penalty
      const penalty = (amount * this.#penaltyPercentage) / 100;
      amountToDeduct = amount + penalty;

      if (amountToDeduct > currentBalance) {
        throw new Error(`Insufficient funds to cover withdrawal amount and penalty of ${penalty}.`);
      }

      super._addTransaction({
        type: "Penalty Deduction",
        amount: penalty,
        date: new Date(),
        description: "Premature Withdrawal Penalty"
      });
    }

    super._setBalance(currentBalance - amountToDeduct);

    super._addTransaction({
      type: "Withdrawal",
      amount: amount,
      date: new Date(),
      description: "Fixed Deposit Withdrawal"
    });

    return super.getBalance();
  }

  // Polymorphism: Overriding the calculateInterest method
  // FD Accounts typically use Compound Interest: P * (1 + R/n)^(nt) - P
  // For simplicity here, assuming annually compounded over T=1 year.
  calculateInterest() {
    const principal = super.getBalance();
    // A = P(1 + r/n)^(nt)
    // Assuming n=1 (annually), t=1
    const rateDecimal = this.#interestRate / 100;
    const amount = principal * Math.pow(1 + rateDecimal, 1);
    const interest = amount - principal;
    
    super._setBalance(principal + interest);

    super._addTransaction({
      type: "Interest Credit",
      amount: interest,
      date: new Date(),
      description: `Compound Interest added at ${this.#interestRate}%`
    });

    return interest;
  }
}

module.exports = FixedDepositAccount;
