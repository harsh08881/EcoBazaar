const bcrypt = require('bcrypt');
const User = require('../modals/userSchema'); 
const jwt = require('jsonwebtoken');

const mockUserProfile = {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    age: 30,
    address: "123 Main St, Anytown, USA"
  };
  
  // Controller function to get user profile
  const getProfile = (req, res) => {
    try {
      // In a real-world application, fetch the profile data from a database here
      res.status(200).json({
        success: true,
        data: mockUserProfile
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


const JWT_SECRET = process.env.JWT_SECRET || "Harsh";

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

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

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
  
  module.exports = {
    getProfile,
    saveUserData,
    loginUser
  };