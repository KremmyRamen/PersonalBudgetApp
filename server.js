  const express = require('express');
  const compression = require('compression');
  const mongoose = require('mongoose');
  const path = require('path');

  const authRouter = require('./routes/auth');
  const budgetRouter = require('./routes/budget');
  const errorHandler = require('./middleware/error');

  const app = express();
  const PORT = 3000;
  const mongoURI = 'mongodb://localhost:27017/test';

  mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(compression());

  app.use(express.static(path.join(__dirname, 'public')));
  app.use('/pages', express.static(path.join(__dirname, 'pages')));
  app.use('/css', express.static(path.join(__dirname, 'css')));
  app.use('/js', express.static(path.join(__dirname, 'js')));

  app.use('/auth', authRouter);
  app.use('/api', budgetRouter);
  app.use(errorHandler);

  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'index.html'));
  });

  app.get('/pages/:page', (req, res) => {
    const page = req.params.page; // Ensure this variable is correctly defined and used
    res.sendFile(path.join(__dirname, 'pages', page));
  });

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
