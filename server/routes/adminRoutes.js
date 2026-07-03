const express = require('express');
const router = express.Router();
const { freezeAccount, activateAccount, getAnalytics } = require('../controllers/adminController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.post('/accounts/:accountNumber/freeze', protect, admin, freezeAccount);
router.post('/accounts/:accountNumber/activate', protect, admin, activateAccount);
router.get('/analytics', protect, admin, getAnalytics);

module.exports = router;
