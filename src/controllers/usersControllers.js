const bcrypt = require('bcrypt');
const User = require('../modals/userSchema'); 
const Device = require('../modals/userDevice');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/constant');
  
  
  const getProfile = async (req, res) => {
    try {
      
      const user = req.user;
  
     
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found."
        });
      }
  
      
      const userProfile = {
        id: user._id,
        email: user.email,
        name: user.name,
        profilePhoto: user.profilePhoto,
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
  


const saveUserData = async (req, res) => {
    try {
        const { number, email, password, name, dob, profilePhoto } = req.body;
        
        console.log(req.body);

        if (!number || !email || !password || !name || !dob) {
            return res.status(400).json({ error: 'All required fields must be provided.' });
        }

    
        const existingUser = await User.findOne({ $or: [{ email }, { number }] });
        if (existingUser) {
            return res.status(400).json({ error: 'User with this email or number already exists.' });
        }

       
        const hashedPassword = await bcrypt.hash(password, 10);

      
        const newUser = new User({
            number,
            email,
            password: hashedPassword,
            name,
            dob,
            profilePhoto: profilePhoto || null,
        });

       
        const savedUser = await newUser.save();

      
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

    
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

  
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

   
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

  
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
    next(error); 
  }
};

const addDevice = async (req, res) => {
  try {
   
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized. User not found.',
      });
    }

  
    const { deviceType, os, osVersion, deviceModel } = req.body;

 
    if (!deviceType || !os || !osVersion || !deviceModel) {
      return res.status(400).json({
        success: false,
        message: 'All device details are required.',
      });
    }
    
    const newDevice = new Device({
      userId: user._id, 
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



// Controller to get user data
const getUserData = async (req, res) => {
  try {
    // Assuming the user is authenticated and user ID is available in req.user
    const userId = req.user?._id;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Find user by ID and exclude sensitive fields like password
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
   

    // Respond with user data
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Error fetching user data:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

  
  module.exports = {
    getProfile,
    saveUserData,
    loginUser,
    addDevice,
    getUserData
  };