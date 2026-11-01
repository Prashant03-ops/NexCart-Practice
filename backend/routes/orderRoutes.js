const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");
const {
  createOrder,
  getOrders,
  myOrders,
  getOrderById,
  updateOrderStatus,
} = require("../controller/orderController");

const router = express.Router();

// Create order + Get all orders (admin)
router
  .route("/")
  .post(protect, createOrder)
  .get(protect, admin, getOrders);

// Get logged-in user's orders
router.route("/myorders").get(protect, myOrders);

// Get single order by ID
router.route("/:id").get(protect, getOrderById);

// Update order status (admin only)
router.route("/:id/status").put(protect, admin, updateOrderStatus);

module.exports = router;