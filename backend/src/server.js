require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const logger = require('./utils/logger');

// Import routes
const authRoutes = require('./routes/auth.routes');
// const userRoutes = require('./routes/user.routes');
// const subcontractorRoutes = require('./routes/subcontractor.routes');
// const reviewRoutes = require('./routes/review.routes');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Subcontractor Management System API' });
});

// Apply routes
app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/subcontractors', subcontractorRoutes);
// app.use('/api/reviews', reviewRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Start server
const startServer = async () => {
  try {
    // Sync database (in development)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      logger.info('Database synchronized');
    }
    
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Unable to start server:', error);
    process.exit(1);
  }
};

startServer();