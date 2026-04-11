const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
// const db = require('../db/mongodb');
const User = require('../models/user');
const passport = require('passport');

// Google login
router.get('/google',
  passport.authenticate('google', { scope: ['profile'] })
);

// Callback
router.get('/google/callback',
  passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/auth/failure'
  })
);

router.get('/failure', (req, res) => {
  res.status(401).send('Login failed');
});

router.get('/me', (req, res) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.status(401).json({ message: 'Not logged in' });
  }
});

router.get('/logout', (req, res) => {
  req.logout(() => {
    res.send('Logged out');
  });
});

// register
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "Username, email, and password are required" });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            username,
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

        // 👇 THIS IS THE FIX
        req.login(user, (err) => {
            if (err) {
                return res.status(500).json({ message: err.message });
            }

            res.json({ message: "Login successful" });
        });

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