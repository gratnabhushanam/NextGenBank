const Loan = require('../models/Loan');

// @desc    Apply for a new loan
// @route   POST /api/loans
// @access  Private (Customer)
const applyLoan = async (req, res) => {
  try {
    const { amount, durationMonths, loanType, termsAccepted } = req.body;
    
    if (!amount || !durationMonths || !loanType) {
      return res.status(400).json({ message: 'Amount, duration, and loan type are required' });
    }

    if (termsAccepted !== 'true' && termsAccepted !== true) {
      return res.status(400).json({ message: 'You must accept the terms and conditions' });
    }

    let panCardUrl = null;
    let aadhaarCardUrl = null;
    let propertyDocUrl = null;

    if (req.files) {
      if (req.files.panCard && req.files.panCard[0]) {
        panCardUrl = `/${req.files.panCard[0].path.replace(/\\/g, '/')}`;
      }
      if (req.files.aadhaarCard && req.files.aadhaarCard[0]) {
        aadhaarCardUrl = `/${req.files.aadhaarCard[0].path.replace(/\\/g, '/')}`;
      }
      if (req.files.propertyDoc && req.files.propertyDoc[0]) {
        propertyDocUrl = `/${req.files.propertyDoc[0].path.replace(/\\/g, '/')}`;
      }
    }

    let calculatedInterestRate = 10.5;
    switch (loanType) {
      case 'Education Loan':
        calculatedInterestRate = 2.5;
        break;
      case 'Earth/Agriculture Loan':
        calculatedInterestRate = 1.5;
        break;
      case 'Property/Home Loan':
        calculatedInterestRate = 8.5;
        break;
      case 'Vehicle Loan':
        calculatedInterestRate = 9.0;
        break;
      case 'Personal Loan':
      default:
        calculatedInterestRate = 10.5;
        break;
    }

    const loan = await Loan.create({
      customerId: req.user.id,
      amount: Number(amount),
      durationMonths: Number(durationMonths),
      interestRate: calculatedInterestRate,
      loanType,
      panCardUrl,
      aadhaarCardUrl,
      propertyDocUrl,
      termsAccepted: true,
      status: 'Pending'
    });

    res.status(201).json(loan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's loans
// @route   GET /api/loans/my
// @access  Private
const getMyLoans = async (req, res) => {
  try {
    const loans = await Loan.findAll({ where: { customerId: req.user.id } });
    res.json(loans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all pending loans
// @route   GET /api/loans/pending
// @access  Private (Manager)
const getPendingLoans = async (req, res) => {
  try {
    const loans = await Loan.findAll({ where: { status: 'Pending' } });
    res.json(loans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve or Reject a loan
// @route   PUT /api/loans/:id
// @access  Private (Manager)
const updateLoanStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const loanId = req.params.id;

    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const loan = await Loan.findByPk(loanId);
    
    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }

    if (loan.status === 'Pending' && status === 'Approved') {
      const AccountModel = require('../models/AccountModel');
      const Transaction = require('../models/Transaction');
      
      const user = await require('../models/User').findByPk(loan.customerId);
      
      // Find a savings account to credit
      let userAccount = await AccountModel.findOne({ 
        where: { email: user.email, accountType: 'Savings', status: 'Active' }
      });

      // Fallback to any active account
      if (!userAccount) {
        userAccount = await AccountModel.findOne({ 
          where: { email: user.email, status: 'Active' }
        });
      }

      if (!userAccount) {
        return res.status(400).json({ message: 'Customer has no active accounts to credit the loan amount to.' });
      }

      userAccount.balance += Number(loan.amount);
      await userAccount.save();

      await Transaction.create({
        accountNumber: userAccount.accountNumber,
        transactionType: 'Deposit',
        amount: loan.amount,
        balanceAfterTransaction: userAccount.balance,
        description: `Loan Disbursement (Loan ID: ${loan.id})`
      });
    }

    loan.status = status;
    loan.assignedManagerId = req.user.id;
    await loan.save();

    res.json({ message: `Loan ${status.toLowerCase()} successfully`, loan });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  applyLoan,
  getMyLoans,
  getPendingLoans,
  updateLoanStatus
};
