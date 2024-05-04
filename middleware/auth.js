// middleware/auth.js
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  jwt.verify(token, 'your-secret-key', (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired' });
      } else {
        return res.status(403).json({ message: 'Invalid token' });
      }
    }

    // Attach the decoded user data to the request object
    req.userId = decoded.userId;  // Ensure this matches how you store the userId in the token during the login process
    next();
  });
}

module.exports = authenticateToken;
