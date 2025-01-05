const jwt = require('jsonwebtoken');
const User = require('../modals/userSchema'); // Adjust path if needed
const { JWT_SECRET } = require('../utils/constant'); // Ensure this is correctly destructured

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJudW1iZXIiOiI5NDQ2NzQ1Njc4IiwiaWF0IjoxNzM2MDYxMDk0LCJleHAiOjE3MzYwNjQ2OTR9.QmEvihao6Ar0ERU9td9cf2zKDpDN15qm1-0G7SODg9U";
    console.log('Token:', token);

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    console.log('JWT_SECRET:', JWT_SECRET);

    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Decoded Token:', decoded);

    // Find the user by number
    const user = await User.findOne({ number: decoded.number });
    if (!user) {
      console.log('User not found');
      return res.status(401).json({ error: 'Invalid token' });
    }

    console.log('User Found:', user);

    // Attach the user to the request object
    req.user = user;

    next(); // Proceed to the next middleware
  } catch (error) {
    console.error('Error in verifyToken:', error.message);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = verifyToken;
