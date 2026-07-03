const Transaction = require('../models/Transaction');

// @desc    Get all transactions
// @route   GET /api/transactions
// @access  Private
const getTransactions = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;
    const offset = (page - 1) * limit;

    const { count, rows } = await Transaction.findAndCountAll({
      order: [['date', 'DESC']],
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

// @desc    Get transactions by account number
// @route   GET /api/transactions/:accountNumber
// @access  Private
const getAccountTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      where: { accountNumber: req.params.accountNumber },
      order: [['date', 'DESC']]
    });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTransactions,
  getAccountTransactions
};
