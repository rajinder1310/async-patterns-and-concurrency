const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const dataRoutes = require('./routes/dataRoutes');
require('dotenv').config();

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10kb' }));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', limiter);

// Prevent Parameter Pollution
app.use(hpp());

// Mount Routes
app.use('/api/data', dataRoutes);

// Root Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
