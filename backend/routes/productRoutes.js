
const express = require('express');
const multer = require('multer');

const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controller/productController');

const router = express.Router();

// Store uploaded files temporarily in memory.
// This avoids relying on persistent local storage on Vercel.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      return cb(null, true);
    }

    cb(new Error('Only image files are allowed'));
  }
});

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Admin-only routes
router.post(
  '/',
  protect,
  admin,
  upload.single('image'),
  createProduct
);

router.put(
  '/:id',
  protect,
  admin,
  upload.single('image'),
  updateProduct
);

router.delete(
  '/:id',
  protect,
  admin,
  deleteProduct
);

module.exports = router;

