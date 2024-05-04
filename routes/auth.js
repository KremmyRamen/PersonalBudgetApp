// routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const router = express.Router();

// Signup route
router.post('/signup', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate username and password
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        // Check if username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate username and password
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        // Check if user exists
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Validate password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id, username: user.username }, 'your-secret-key', { expiresIn: '1h' });

        // Send the response with token and userId
        // Removed the redundant response line
        res.status(200).json({ token, userId: user._id.toString() });  // Only one response is sent here
    } catch (error) {
        console.error(error);
        // Ensure no additional response is sent if headers are already sent
        if (!res.headersSent) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
});


module.exports = router;
