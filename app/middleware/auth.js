const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Adjust the path
const JWT_SECRET = process.env.JWT_SECRET

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.redirect('/Asur'); // or res.status(401).json({ message: 'Access denied' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) return res.redirect('/Asur');

    req.user = user;
    next();
  } catch (err) {
    return res.redirect('/Asur');
  }
};

module.exports = authMiddleware;
