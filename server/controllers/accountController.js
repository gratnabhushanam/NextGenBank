const AccountModel = require('../models/AccountModel');
const Transaction = require('../models/Transaction');
const AccountFactory = require('../classes/AccountFactory');
const { sequelize } = require('../utils/db');

// Helper function to re-hydrate OOP Account instance from DB Model
const hydrateAccount = (dbAccount) => {
  return AccountFactory.createAccount(dbAccount.accountType, {
    accountNumber: dbAccount.accountNumber,
    accountHolderName: dbAccount.holderName,
    email: dbAccount.email,
    phone: dbAccount.phone,
    initialBalance: dbAccount.balance
  });
};

// @desc    Create a new bank account
// @route   POST /api/accounts
// @access  Private
const createAccount = async (req, res) => {
  try {
    const { holderName, email, phone, accountType, initialBalance, branch, ifsc, nominee, panNumber, aadhaarNumber, businessName } = req.body;
    
    // Generate unique account number
    const prefix = accountType === 'Savings' ? 'SB' : accountType === 'Current' ? 'CA' : 'FD';
    const accountNumber = prefix + Math.floor(1000000 + Math.random() * 9000000).toString();

    // Use Factory Pattern to create pure OOP object to validate initial rules
    const oopAccount = AccountFactory.createAccount(accountType, {
      accountNumber,
      accountHolderName: holderName,
      email,
      phone,
      initialBalance: Number(initialBalance) || 0,
      branch,
      ifsc
    });

    oopAccount.validateAccount();

    // Save to Database
    const newAccount = await AccountModel.create({
      accountNumber,
      holderName,
      email,
      phone,
      accountType,
      balance: oopAccount.getBalance(),
      branch: branch || 'MAIN_BRANCH',
      ifsc: ifsc || 'BANK0001234',
      nominee,
      panNumber,
      aadhaarNumber,
      businessName
    });

    res.status(201).json(newAccount);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const User = require('../models/User');
const bcrypt = require('bcrypt');

// @desc    Create a new user and bank account simultaneously by an employee
// @route   POST /api/accounts/employee-create
// @access  Private/Employee
const createCustomerByEmployee = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { 
      name, email, phone, password, 
      accountType, initialBalance, branch, ifsc, nominee, panNumber, aadhaarNumber, businessName 
    } = req.body;

    // 1. Create User
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      throw new Error('User email already exists in the system');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.create({
      name,
      email,
      password: hashedPassword,
      phone: phone || '0000000000',
      role: 'customer',
    }, { transaction });

    // 2. Create Account
    const prefix = accountType === 'Savings' ? 'SB' : accountType === 'Current' ? 'CA' : 'FD';
    const accountNumber = prefix + Math.floor(1000000 + Math.random() * 9000000).toString();

    const oopAccount = AccountFactory.createAccount(accountType, {
      accountNumber,
      accountHolderName: name,
      email,
      phone,
      initialBalance: Number(initialBalance) || 0,
      branch,
      ifsc
    });
    oopAccount.validateAccount();

    const newAccount = await AccountModel.create({
      accountNumber,
      holderName: name,
      email,
      phone,
      accountType,
      balance: oopAccount.getBalance(),
      branch: branch || 'MAIN_BRANCH',
      ifsc: ifsc || 'BANK0001234',
      nominee,
      panNumber,
      aadhaarNumber,
      businessName
    }, { transaction });

    await transaction.commit();

    res.status(201).json({
      message: 'Customer and Account created successfully',
      accountNumber: newAccount.accountNumber,
      password: password // Returning this so employee can copy it, usually this is sent via email
    });

  } catch (error) {
    await transaction.rollback();
    res.status(400).json({ message: error.message });
  }
};

const getAccounts = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;
    const offset = (page - 1) * limit;

    const { count, rows } = await AccountModel.findAndCountAll({
      limit,
      offset
    });
    
    res.json({
      total: count,
      page,
      pages: Math.ceil(count / limit),
      data: rows
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Deposit Money
// @route   POST /api/accounts/deposit
// @access  Private
const depositMoney = async (req, res) => {
  try {
    const { accountNumber, amount } = req.body;
    
    const dbAccount = await AccountModel.findOne({ where: { accountNumber } });
    if (!dbAccount) return res.status(404).json({ message: 'Account not found' });

    // Hydrate OOP Object
    const oopAccount = hydrateAccount(dbAccount);

    // Call deposit (common method)
    const newBalance = oopAccount.deposit(Number(amount));

    // Save updated balance to DB
    dbAccount.balance = newBalance;
    await dbAccount.save();

    // Save transaction to DB
    const transactions = oopAccount.getTransactions();
    const latestTransaction = transactions[transactions.length - 1];
    
    await Transaction.create({
      accountNumber,
      transactionType: latestTransaction.type,
      amount: latestTransaction.amount,
      balanceAfterTransaction: newBalance,
      description: latestTransaction.description
    });

    res.json({ message: 'Deposit successful', balance: newBalance });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Withdraw Money
// @route   POST /api/accounts/withdraw
// @access  Private
const withdrawMoney = async (req, res) => {
  try {
    const { accountNumber, amount } = req.body;
    
    const dbAccount = await AccountModel.findOne({ where: { accountNumber } });
    if (!dbAccount) return res.status(404).json({ message: 'Account not found' });

    // Hydrate OOP Object
    const oopAccount = hydrateAccount(dbAccount);

    // Call withdraw (Polymorphic Method Overriding in action)
    const newBalance = oopAccount.withdraw(Number(amount));

    // Save updated balance to DB
    dbAccount.balance = newBalance;
    await dbAccount.save();

    // The OOP object may have generated multiple transactions
    const transactions = oopAccount.getTransactions();
    
    for (let txn of transactions) {
      await Transaction.create({
        accountNumber,
        transactionType: txn.type,
        amount: txn.amount,
        balanceAfterTransaction: newBalance, 
        description: txn.description
      });
    }

    res.json({ message: 'Withdrawal successful', balance: newBalance });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Transfer Money
// @route   POST /api/accounts/transfer
// @access  Private
const transferMoney = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { fromAccountNumber, toAccountNumber, amount } = req.body;
    
    if (fromAccountNumber === toAccountNumber) {
      throw new Error('Cannot transfer to the same account.');
    }

    const fromDbAccount = await AccountModel.findOne({ where: { accountNumber: fromAccountNumber } }, { transaction });
    const toDbAccount = await AccountModel.findOne({ where: { accountNumber: toAccountNumber } }, { transaction });

    if (!fromDbAccount) throw new Error('Sender account not found');
    if (!toDbAccount) throw new Error('Receiver account not found');

    // Hydrate Sender OOP Object
    const fromOopAccount = hydrateAccount(fromDbAccount);
    // Withdraw (Polymorphic)
    const newFromBalance = fromOopAccount.withdraw(Number(amount));
    fromDbAccount.balance = newFromBalance;
    await fromDbAccount.save({ transaction });

    // Save Sender Transactions
    const fromTransactions = fromOopAccount.getTransactions();
    for (let txn of fromTransactions) {
      // Only save the latest generated transactions (simplified logic)
      if (txn.amount === Number(amount) && txn.type === 'Withdrawal') {
         await Transaction.create({
          accountNumber: fromAccountNumber,
          transactionType: 'Transfer',
          amount: txn.amount,
          balanceAfterTransaction: newFromBalance, 
          description: `Transfer to ${toAccountNumber}`
        }, { transaction });
      }
    }

    // Hydrate Receiver OOP Object
    const toOopAccount = hydrateAccount(toDbAccount);
    // Deposit
    const newToBalance = toOopAccount.deposit(Number(amount));
    toDbAccount.balance = newToBalance;
    await toDbAccount.save({ transaction });

    await Transaction.create({
      accountNumber: toAccountNumber,
      transactionType: 'Transfer',
      amount: Number(amount),
      balanceAfterTransaction: newToBalance, 
      description: `Transfer from ${fromAccountNumber}`
    }, { transaction });

    await transaction.commit();

    res.json({ message: 'Transfer successful', balance: newFromBalance });
  } catch (error) {
    await transaction.rollback();
    res.status(400).json({ message: error.message });
  }
};

// @desc    Apply Interest to all accounts
// @route   POST /api/accounts/apply-interest
// @access  Private/Admin
const applyInterest = async (req, res) => {
  try {
    const dbAccounts = await AccountModel.findAll({ where: { status: 'Active' } });
    
    let totalInterestApplied = 0;

    for (const dbAccount of dbAccounts) {
      const oopAccount = hydrateAccount(dbAccount);
      const interestEarned = oopAccount.calculateInterest();

      if (interestEarned > 0) {
        dbAccount.balance = oopAccount.getBalance();
        await dbAccount.save();

        totalInterestApplied += interestEarned;

        await Transaction.create({
          accountNumber: dbAccount.accountNumber,
          transactionType: 'Interest Credit',
          amount: interestEarned,
          balanceAfterTransaction: dbAccount.balance,
          description: 'Scheduled Interest Application'
        });
      }
    }

    res.json({ message: 'Interest applied successfully.', totalInterestApplied });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createAccount,
  createCustomerByEmployee,
  getAccounts,
  depositMoney,
  withdrawMoney,
  transferMoney,
  applyInterest
};
