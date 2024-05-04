const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const mongoose = require('mongoose');
const path = require('path');

// Import routes
const authRouter = require('./routes/auth');
const budgetRouter = require('./routes/budget'); // Make sure this path is correct
const errorHandler = require('./middleware/error');

const app = express();
const PORT = 3000;

// MongoDB connection URI
const mongoURI = 'mongodb://localhost:27017/test'; // Update as necessary

// Connect to MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Middleware
app.use(bodyParser.json());
app.use(compression());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));

// Routes
app.use('/auth', authRouter);
app.use('/api', budgetRouter); // This line mounts your budgetRouter under '/api'
app.use(errorHandler);

// Serve static files
app.use(express.static(path.join(__dirname, 'pages')));

// Additional static files for CSS
app.use('/css', express.static(path.join(__dirname, 'css'), {
  setHeaders: (res, filePath) => {
    if (path.extname(filePath) === '.css') {
      res.setHeader('Content-Type', 'text/css');
    }
  }
}));

// Landing page route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'landingpage.html'));
});

// Dynamic page route
app.get('/pages/:page', (req, res) => {
  const page = req.params.page;
  res.sendFile(path.join(__dirname, 'pages', page));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
