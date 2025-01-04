const express = require("express");
require("dotenv").config(); 
const connectToMongoDB = require("./config/connectdb");
const router = require('./src/routes/user');
const errorHandler = require('./src/middleware/errorhandler');
const app = express();
const PORT = process.env.PORT || 5001; 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(errorHandler);

connectToMongoDB();

app.get("/", (req, res) => {
  res.send("Server is running successfully!");
});

app.use('/user', router)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
