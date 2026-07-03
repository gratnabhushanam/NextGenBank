const User = require('../models/User');
const AccountModel = require('../models/AccountModel');
const Transaction = require('../models/Transaction');

// @desc    Freeze an account
// @route   POST /api/admin/accounts/:accountNumber/freeze
// @access  Private/Admin
const freezeAccount = async (req, res) => {
  try {
    const account = await AccountModel.findOne({ where: { accountNumber: req.params.accountNumber } });
    if (!account) return res.status(404).json({ message: 'Account not found' });

    account.status = 'Frozen';
    await account.save();

    res.json({ message: 'Account frozen successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Activate an account
// @route   POST /api/admin/accounts/:accountNumber/activate
// @access  Private/Admin
const activateAccount = async (req, res) => {
  try {
    const account = await AccountModel.findOne({ where: { accountNumber: req.params.accountNumber } });
    if (!account) return res.status(404).json({ message: 'Account not found' });

    account.status = 'Active';
    await account.save();

    res.json({ message: 'Account activated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get total analytics
// @route   GET /api/admin/analytics
// @access  Private/Admin
const getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalAccounts = await AccountModel.count();
    
    // Aggregation is simpler, but we can just use sum() in sequelize
    const totalDeposits = await Transaction.sum('amount', { where: { transactionType: 'Deposit' } }) || 0;
    const totalWithdrawals = await Transaction.sum('amount', { where: { transactionType: 'Withdrawal' } }) || 0;
    const totalInterest = await Transaction.sum('amount', { where: { transactionType: 'Interest Credit' } }) || 0;

    res.json({
      totalUsers,
      totalAccounts,
      totalDeposits,
      totalWithdrawals,
      totalInterest
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  freezeAccount,
  activateAccount,
  getAnalytics
};
