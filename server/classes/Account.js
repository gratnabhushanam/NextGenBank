/**
 * Abstract Account Class
 * Demonstrates Abstraction and Encapsulation
 */
class Account {
  // Encapsulation: Private fields
  #balance;
  #accountNumber;
  #accountHolderName;
  #email;
  #phone;
  #accountType;
  #branch;
  #ifsc;
  #status;
  #transactions; // List to store transaction history internally

  constructor(accountNumber, accountHolderName, email, phone, initialBalance, accountType, branch, ifsc) {
    // Abstraction: Prevent direct instantiation of this base class
    if (new.target === Account) {
      throw new Error("Abstract class 'Account' cannot be instantiated directly.");
    }

    this.#accountNumber = accountNumber;
    this.#accountHolderName = accountHolderName;
    this.#email = email;
    this.#phone = phone;
    this.#balance = initialBalance;
    this.#accountType = accountType;
    this.#branch = branch || 'MAIN_BRANCH';
    this.#ifsc = ifsc || 'BANK0001234';
    this.#status = 'Active';
    this.#transactions = [];

    // Log the initial deposit
    if (initialBalance > 0) {
      this.#transactions.push({
        type: "Deposit",
        amount: initialBalance,
        date: new Date(),
        description: "Initial Deposit"
      });
    }
  }

  // Getters for encapsulated properties
  getAccountNumber() {
    return this.#accountNumber;
  }

  getAccountHolderName() {
    return this.#accountHolderName;
  }

  getEmail() {
    return this.#email;
  }

  getPhone() {
    return this.#phone;
  }

  getAccountType() {
    return this.#accountType;
  }

  // Encapsulation: Controlled access to balance
  getBalance() {
    return this.#balance;
  }

  getTransactions() {
    return this.#transactions;
  }

  // Common Methods

  deposit(amount) {
    if (amount <= 0) {
      throw new Error("Deposit amount must be greater than zero.");
    }
    this.#balance += amount;
    this.#transactions.push({
      type: "Deposit",
      amount,
      date: new Date(),
      description: "Regular Deposit"
    });
    return this.#balance;
  }

  // Protected setter-like method for internal use by subclasses during operations like penalty deductions
  _setBalance(newBalance) {
    if (newBalance < 0) {
      throw new Error("Balance cannot be negative in a standard account.");
    }
    this.#balance = newBalance;
  }

  // Protected setter-like method for Current Accounts to allow overdrafts
  _setBalanceOverdraft(newBalance) {
    this.#balance = newBalance;
  }

  _addTransaction(transaction) {
    this.#transactions.push(transaction);
  }

  displayAccount() {
    return {
      accountNumber: this.#accountNumber,
      accountHolderName: this.#accountHolderName,
      email: this.#email,
      phone: this.#phone,
      balance: this.#balance,
      accountType: this.#accountType
    };
  }

  validateAccount() {
    if (!this.#accountNumber || !this.#accountHolderName || !this.#email || !this.#phone) {
      throw new Error("Account details are incomplete.");
    }
    return true;
  }

  // Abstract Methods (Must be overridden by subclasses)
  
  withdraw(amount) {
    throw new Error("Method 'withdraw()' must be implemented by subclass.");
  }

  calculateInterest() {
    throw new Error("Method 'calculateInterest()' must be implemented by subclass.");
  }
}

module.exports = Account;
