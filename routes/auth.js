const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
// const db = require('../db/mongodb');
const User = require('../models/user');

// register
router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            email,
            password: hashedPassword
        });

        res.status(201).json({ message: "User registered successfully" });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password" });
        }

        req.session.user = {
            _id: user._id,
            email: user.email
        };

        res.json({ message: "Login successful" });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// logout
router.post('/logout', (req, res) => {
    req.session.destroy();
    res.send("Logged out");
});

module.exports = router;