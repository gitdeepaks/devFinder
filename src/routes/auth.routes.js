const bcrypt = require('bcryptjs');
const express = require('express');
const User = require('../models/user.model');
const { validateSignUpData } = require('../utils/validation');

const authRouter = express.Router();

authRouter.post('/signup', async (req, res) => {
  try {
    // validation of data
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;

    //Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);

    // console.log(passwordHash);

    //Generate a JWT token

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    await user.save();
    res.status(201).json({
      message: 'User created successfully',
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: 'User creation failed',
      error: error.message,
    });
  }
});

// Login API
authRouter.post('/login', async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId });

    if (!user) {
      return res.status(400).json({
        message: 'Something went wrong',
      });
    }
    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      // Creating a JWT token

      const token = await user.getJWT();
      console.log(token);

      // Add a token to cookie and send the response back to user
      res.cookie('token', token, {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });

      return res.status(200).json({
        message: 'Login successful',
        user,
      });
    } else {
      return res.status(400).json({
        message: 'Something went wrong',
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Unauthorized',
      error: error.message,
    });
  }
});

// Logout API
authRouter.post('/logout', async (req, res) => {
  try {
    res.cookie('token', 'null', {
      expires: new Date(Date.now()),
    });
    res.status(200).json({
      message: 'Logout successful',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong',
      error: error.message,
    });
  }
});
module.exports = authRouter;
