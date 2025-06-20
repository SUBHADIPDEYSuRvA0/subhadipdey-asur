const User = require('../../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET; // Keep in env for production

// ✅ Signup
exports.signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword
    });

    await user.save();

    res.status(201).json({ message: 'Signup successful', userId: user._id });
  } catch (err) {
    res.status(500).json({ message: 'Signup error', error: err.message });
  }
};

// ✅ Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '2h' });

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 2 * 60 * 60 * 1000 // 2 hours
    });

    res.redirect('/Asur/home');
  } catch (err) {
    res.status(500).json({ message: 'Login error', error: err.message });
  }
}
// ✅ Forgot Password (Simple reset)
exports.forgotPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Reset error', error: err.message });
  }
};
// ✅ Logout
exports.logout = (req, res) => {
  res.clearCookie('token');
  res.redirect('/Asur'); // Redirect to login page or home
};