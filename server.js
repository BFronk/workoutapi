require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const session = require('express-session');
const passport = require('passport');
require('./config/passport');

const app = express();

// ✅ SESSION FIRST
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes

app.post('/test', (req, res) => {
  console.log('TEST HIT', req.body);
  res.send('working');
});

app.use('/auth', require('./routes/auth'));
app.use('/users', require('./routes/users'));
app.use('/', require('./routes/auth'));
app.use('/workouts', require('./routes/workouts'));

app.get('/', (req, res) => {
  res.send('Welcome to the Workout API!');
});

// MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Database connected');
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.error(err));