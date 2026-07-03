const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Document = require('../models/Document');
const { protect } = require('../middlewares/authMiddleware');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(
      null,
      `${req.user.id}-${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|pdf/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Images and PDFs only!');
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// @desc    Upload KYC Document
// @route   POST /api/upload/kyc
// @access  Private
router.post('/kyc', protect, upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }

    const doc = await Document.create({
      userId: req.user.id,
      documentType: 'KYC',
      filePath: `/${req.file.path.replace(/\\/g, '/')}`,
      verificationStatus: 'Pending'
    });

    res.status(201).json({ message: 'Document uploaded successfully', document: doc });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get pending KYC documents
// @route   GET /api/upload/kyc/pending
// @access  Private (Employee/Manager)
router.get('/kyc/pending', protect, async (req, res) => {
  try {
    if (req.user.role !== 'employee' && req.user.role !== 'manager' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const docs = await Document.findAll({
      where: { verificationStatus: 'Pending', documentType: 'KYC' }
    });
    res.json(docs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Verify KYC document
// @route   PUT /api/upload/kyc/:id/verify
// @access  Private (Employee/Manager)
router.put('/kyc/:id/verify', protect, async (req, res) => {
  try {
    if (req.user.role !== 'employee' && req.user.role !== 'manager' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const doc = await Document.findByPk(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Document not found' });

    doc.verificationStatus = req.body.status; // 'Verified' or 'Rejected'
    await doc.save();

    // Optionally update the User model
    const User = require('../models/User');
    const user = await User.findByPk(doc.userId);
    if (user) {
      user.kycStatus = req.body.status;
      await user.save();
    }

    res.json({ message: 'KYC status updated', doc });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
