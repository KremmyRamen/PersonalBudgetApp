const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const mongoose = require('mongoose'); // Import Mongoose
const authRouter = require('./routes/auth');
const errorHandler = require('./middleware/error');
const path = require('path');

const app = express();
const PORT = 3000;

// MongoDB connection URI (replace with your MongoDB URI)
const mongoURI = 'mongodb://localhost:27017';
// const mongoURI = 'mongodb://username:password@localhost:27017/databaseName';

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

app.use(bodyParser.json());
app.use(compression());

// Serve static files
app.use(express.static(path.join(__dirname, 'pages')));
app.use('/css', express.static(path.join(__dirname, 'css'), {
  setHeaders: (res, filePath) => {
    if (path.extname(filePath) === '.css') {
      res.setHeader('Content-Type', 'text/css');
    }
  }
}));

app.use('/auth', authRouter);
app.use(errorHandler);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'landingpage.html'));
});

app.get('/pages/:page', (req, res) => {
  const page = req.params.page;
  res.sendFile(path.join(__dirname, 'pages', page));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
