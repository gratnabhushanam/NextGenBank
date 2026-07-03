const express = require('express');
const router = express.Router();
const { getTransactions, getAccountTransactions } = require('../controllers/transactionController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/').get(protect, getTransactions);
router.route('/:accountNumber').get(protect, getAccountTransactions);

module.exports = router;
