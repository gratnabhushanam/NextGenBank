const SavingsAccount = require('./SavingsAccount');
const CurrentAccount = require('./CurrentAccount');
const FixedDepositAccount = require('./FixedDepositAccount');

/**
 * Account Factory Class
 * Demonstrates the Factory Design Pattern
 */
class AccountFactory {
  /**
   * Creates an account based on the requested type.
   */
  static createAccount(type, accountParams) {
    const {
      accountNumber,
      accountHolderName,
      email,
      phone,
      initialBalance,
      branch,
      ifsc
    } = accountParams;

    switch (type) {
      case 'Savings':
        // Default limits can be overridden here
        return new SavingsAccount(accountNumber, accountHolderName, email, phone, initialBalance, branch, ifsc);
      case 'Current':
        return new CurrentAccount(accountNumber, accountHolderName, email, phone, initialBalance, branch, ifsc);
      case 'FixedDeposit':
        return new FixedDepositAccount(accountNumber, accountHolderName, email, phone, initialBalance, branch, ifsc);
      default:
        throw new Error(`Invalid Account Type: ${type}`);
    }
  }
}

module.exports = AccountFactory;
