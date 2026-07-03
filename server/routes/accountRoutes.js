const express = require('express');
const router = express.Router();
const { 
  createAccount, 
  createCustomerByEmployee,
  getAccounts, 
  depositMoney, 
  withdrawMoney, 
  transferMoney,
  applyInterest 
} = require('../controllers/accountController');
const { protect, admin, employee } = require('../middlewares/authMiddleware');

router.route('/')
  .post(protect, createAccount)
  .get(protect, getAccounts); // Ideally should be protected and only for admin/employee to see all

router.post('/employee-create', protect, employee, createCustomerByEmployee);
router.post('/deposit', protect, depositMoney);
router.post('/withdraw', protect, withdrawMoney);
router.post('/transfer', protect, transferMoney);
router.post('/apply-interest', protect, admin, applyInterest);

module.exports = router;
