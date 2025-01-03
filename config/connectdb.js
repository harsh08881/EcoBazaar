const mongoose = require("mongoose");
const connectToMongoDB = async (uri) => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit the process with an error code
  }
};

// Example usage
const uri = "your_mongodb_connection_string";
 

module.exports = connectToMongoDB;
