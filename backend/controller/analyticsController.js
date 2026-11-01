
const Order = require("../model/Order");
const User = require("../model/user");
const Product = require("../model/Product");

const getAdminStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: "user" });
        const totalOrders = await Order.countDocuments({});
        const totalProducts = await Product.countDocuments({});

        const orders = await Order.find({});
        
        const totalRevenue = orders.reduce(
            (acc, order) => acc + (Number(order.totalAmount) || 0),
            0
        );

        return res.status(200).json({
            success: true,
            totalUsers,
            totalOrders,
            totalProducts,
            totalRevenue
        });
    } catch (error) {
        console.error("Error fetching admin stats:", error);

        return res.status(500).json({
            success: false,
            message: "Error fetching admin stats"
        });
    }
};

module.exports = { getAdminStats };
