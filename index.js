const express = require("express");
require("dotenv").config(); // Load environment variables
const connectToMongoDB = require("./config/connectdb");
const router = require('./src/routes/user');

const app = express();
const PORT = 3002;

// Connect to MongoDB
// connectToMongoDB();

app.get("/", (req, res) => {
  res.send("Server is running successfully!");
});

app.use('/user', router)
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
