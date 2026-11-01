
const jwt = require('jsonwebtoken');
const User = require('../model/user');
const bcrypt = require('bcryptjs');
const sendEmail = require('../utils/sendEmails');

// Generate JWT token
const generateToken = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
    );
};

// Register user
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: 'Please provide name, email and password'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: 'Password must be at least 6 characters'
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const existingUser = await User.findOne({
            email: normalizedEmail
        });

        if (existingUser) {
            return res.status(400).json({
                message: 'User already exists'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Save user in MongoDB
        const user = await User.create({
            name,
            email: normalizedEmail,
            password: hashedPassword
        });

        // Send welcome email (optional)
        try {
            const message = `
                Welcome to NexCart, ${name}!

                Thank you for registering with us.

                Explore amazing products and enjoy
                a seamless shopping experience.

                Happy Shopping!
                Team NexCart
            `;

            await sendEmail(
                normalizedEmail,
                'Welcome to NexCart',
                message
            );
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
        }

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
        });

    } catch (error) {
        console.error('Registration error:', error);

        res.status(500).json({
            message: 'Server error'
        });
    }
};

// Login user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password are required'
            });
        }

        const user = await User.findOne({
            email: email.trim().toLowerCase()
        });

        if (
            user &&
            await bcrypt.compare(password, user.password)
        ) {
            return res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        }

        res.status(401).json({
            message: 'Invalid email or password'
        });

    } catch (error) {
        console.error('Login error:', error);

        res.status(500).json({
            message: 'Server error'
        });
    }
};

// Get users
const getUser = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');

        res.status(200).json(users);

    } catch (error) {
        console.error('Get users error:', error);

        res.status(500).json({
            message: 'Server error'
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUser
};
