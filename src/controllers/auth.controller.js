const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');    

/**
 * - Registers a new user.
 * - POST /api/auth/register
 */

const userRegisterController = async (req, res) => {
  try {
    const { email, password, name, role } = req.body;
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(422).json({ message: 'Email already exists', status:"failed"});
    }
    const newUser = await userModel.create({ email, password, name, role });
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token);
    res.status(201).json({ message: 'User registered successfully', data: { id: newUser._id, email: newUser.email, name: newUser.name, role: newUser.role }, status: "success", token });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Server error' });
    }
};

/**
 * - Logs in a user and returns a JWT token.
 * - POST /api/auth/login
 */

const userLoginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email }).select('+password');  
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password', status: "failed" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token);
    res.status(200).json({ message: 'Login successful', data: { id: user._id, email: user.email, name: user.name }, status: "success", token });
  
  }
    catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ message: 'Server error' });
  } 
};

/**
 * - User Logout Controller
 * - POST /api/auth/logout
  */
async function userLogoutController(req, res) {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[ 1 ]

    if (!token) {
        return res.status(200).json({
            message: "User logged out successfully"
        })
    }

    res.clearCookie("token")

    res.status(200).json({
        message: "User logged out successfully"
    })

}


module.exports = {
  userRegisterController,  
  userLoginController,
  userLogoutController
};
