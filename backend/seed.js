
require("dotenv").config();

const mongoose = require("mongoose");
const Product = require("./model/Product");

const products = [
    {
        name: "Wireless Headphones",
        description: "High-quality wireless headphones with clear sound.",
        price: 1999,
        category: "Electronics",
        stock: 25,
        imageUrl: "https://placehold.co/600x600?text=Headphones",
    },
    {
        name: "Smart Watch",
        description: "Smart watch with fitness tracking features.",
        price: 2499,
        category: "Electronics",
        stock: 15,
        imageUrl: "https://placehold.co/600x600?text=Smart+Watch",
    },
    {
        name: "Men's Casual T-Shirt",
        description: "Comfortable cotton T-shirt for everyday wear.",
        price: 599,
        category: "Clothing",
        stock: 40,
        imageUrl: "https://placehold.co/600x600?text=T-Shirt",
    },
    {
        name: "Running Shoes",
        description: "Lightweight running shoes for daily workouts.",
        price: 1799,
        category: "Footwear",
        stock: 20,
        imageUrl: "https://placehold.co/600x600?text=Shoes",
    },
    {
        name: "Laptop Backpack",
        description: "Durable backpack with a laptop compartment.",
        price: 999,
        category: "Accessories",
        stock: 30,
        imageUrl: "https://placehold.co/600x600?text=Backpack",
    },
];

const seedProducts = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is missing from .env");
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected");

        const insertedProducts = await Product.insertMany(products);

        console.log(`${insertedProducts.length} products inserted successfully`);
    } catch (error) {
        console.error("Seeding failed:", error.message);
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
    }
};

seedProducts();

