const bcrypt = require('bcrypt');
const User = require('../modals/userSchema'); 
const Device = require('../modals/userDevice');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/constant');
  
  // Controller function to get user profile
  const getProfile = async (req, res) => {
    try {
      // `req.user` should contain the user information after the token is verified
      const user = req.user;
  
      // If there's no user found (this shouldn't happen because of the middleware)
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found."
        });
      }
  
      // You can choose to return only specific fields like email, name, etc.
      const userProfile = {
        id: user._id,
        email: user.email,
        name: user.name,
        profilePhoto: user.profilePhoto,
        // Add more fields as needed from the user object
      };
  
      res.status(200).json({
        success: true,
        data: userProfile
      });
    } catch (error) {
      console.error("Error fetching profile data:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch user profile."
      });
    }
  };
  


// Function to save user data
const saveUserData = async (req, res) => {
    try {
        const { number, email, password, name, dob, profilePhoto } = req.body;

        console.log(req.body);

        // Validate required fields
        if (!number || !email || !password || !name || !dob) {
            return res.status(400).json({ error: 'All required fields must be provided.' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { number }] });
        if (existingUser) {
            return res.status(400).json({ error: 'User with this email or number already exists.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user instance
        const newUser = new User({
            number,
            email,
            password: hashedPassword,
            name,
            dob,
            profilePhoto: profilePhoto || null, // Optional field
        });

        // Save the user to the database
        const savedUser = await newUser.save();

        // Respond with success message
        return res.status(201).json({
            message: 'User registered successfully.',
            user: {
                id: savedUser._id,
                email: savedUser.email,
                name: savedUser.name,
                number: savedUser.number,
            },
        });
    } catch (error) {
        console.error('Error saving user:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};


const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // Generate JWT token with user number
    const token = jwt.sign({ number: user.number }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        profilePhoto: user.profilePhoto,
      },
    });
  } catch (error) {
    next(error); // Pass the error to the error handler middleware
  }
};

const addDevice = async (req, res) => {
  try {
    // Access user from the request object
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized. User not found.',
      });
    }

    // Extract device details from the request body
    const { deviceType, os, osVersion, deviceModel } = req.body;

    // Validate input
    if (!deviceType || !os || !osVersion || !deviceModel) {
      return res.status(400).json({
        success: false,
        message: 'All device details are required.',
      });
    }

    // Create and save the device
    const newDevice = new Device({
      userId: user._id, // Link the device to the authenticated user
      deviceType,
      os,
      osVersion,
      deviceModel,
    });

    await newDevice.save();

    res.status(201).json({
      success: true,
      message: 'Device added successfully.',
      device: newDevice,
    });
  } catch (error) {
    console.error('Error adding device:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to add device.',
    });
  }
};

module.exports = addDevice;


  
  module.exports = {
    getProfile,
    saveUserData,
    loginUser,
    addDevice
  };