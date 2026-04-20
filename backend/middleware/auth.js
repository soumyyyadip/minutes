const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

  try {
    const bearerToken = token.split(' ')[1];
    if (!bearerToken) throw new Error('Invalid token format');
    
    // Fallback secret for local testing
    const decoded = jwt.verify(bearerToken, process.env.JWT_SECRET || 'secretkey');
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid token.' });
  }
};
