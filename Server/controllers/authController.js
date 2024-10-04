const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/User');
const router = express.Router();
dotenv.config();

exports.SignUp = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashPassword = await bcrypt.hash(password, 7);    
    const newUser = new User({
      username,
      email,
      password: hashPassword,
    });

    await newUser.save();   
  } catch (error) {
    console.error('User registration failed:', error);
    return res.status(500).json({ message: 'Error registering user' });
  }
};

exports.Login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User is not registered' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Password is incorrect' });
    }
    
    const token = jwt.sign(
      { username: user.username, userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.cookie('token', token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000,
      sameSite: 'Strict',
    });

    res.cookie('username', user.username, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000,
      sameSite: 'Strict',
    });

    res.cookie('email', user.email, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000,
      sameSite: 'Strict',
    });

    res.json({ message: 'Login successful',
                userId: user._id
     });
  } catch (error) {
    console.error('Login failed:', error);
    return res.status(500).json({ message: 'Error logging in' });
  }
};
exports.Logout = async (req, res) => {
  try {
    const token = req.cookies.token;
    res.cookie('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 0,
    });
    res.status(200).send({ message: 'Logout successful' });
  } catch (error) {
    res.status(500).send({ message: 'Internal server error during logout' });
  }
};
