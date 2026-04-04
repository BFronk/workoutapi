const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

// register
router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Validate input
        if (!email || !password) {
            return res.status(400).send("Email and password are required");
        }

        // 2. Check if user already exists
        const existingUser = await db.collection('users').findOne({ email });

        if (existingUser) {
            return res.status(400).send("User already exists");
        }

        // 3. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. Save user
        await db.collection('users').insertOne({
            email,
            password: hashedPassword
        });

        // 5. Respond
        res.status(201).send("User registered successfully");

    } catch (err) {
        res.status(500).send(err.message);
    }
});

// login
router.post('/login', async (req, res) => {
    try {
            const { email, password } = req.body;
            const user = await db.collection('users').findOne({ email });

            if (!user) {
                return res.status(400).send("User not found");
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).send("Invalid password");
            }

            req.session.user = user;
            res.send("Login successful");

        } catch (err) {
            res.status(500).send(err.message);
    }
});

// logout
router.post('/logout', (req, res) => {
    req.session.destroy();
    res.send("Logged out");
});

module.exports = router;