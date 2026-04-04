require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const app = express();
const session = require('express-session');

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/', require('./routes/auth'));

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the Workout API! Go to /api-docs to explore and test endpoints.');
});
app.use('/workouts', require('./routes/workouts'));
app.use(session({
    secret: 'supersecretkey', // change later
    resave: false,
    saveUninitialized: true
}));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Database connected');
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.error(err));