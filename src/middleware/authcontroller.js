const jwt = require('jsonwebtoken');
const User = require('../modals/userSchema'); 
const { JWT_SECRET } = require('../utils/constant'); 

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    console.log('Token:', token);

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    console.log('JWT_SECRET:', JWT_SECRET);

  
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Decoded Token:', decoded);

   
    const user = await User.findOne({ number: decoded.number });
    if (!user) {
      console.log('User not found');
      return res.status(401).json({ error: 'Invalid token' });
    }

    console.log('User Found:', user);

   
    req.user = user;

    next();
  } catch (error) {
    console.error('Error in verifyToken:', error.message);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = verifyToken;
