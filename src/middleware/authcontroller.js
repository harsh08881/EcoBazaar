const jwt = require('jsonwebtoken');
const User = require('../modals/userSchema'); // Assuming your User model is in this location
const JWT_SECRET = require('../utils/constant');

const verifyToken = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log(token);

    // If no token is found, return unauthorized
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // Verify the token using the secret key
    const decoded = jwt.verify(token, JWT_SECRET);

    // Find the user based on the number from the token
    const user = await User.findOne({ number: decoded.number });
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Attach the user to the request object
    req.user = user;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = verifyToken;
