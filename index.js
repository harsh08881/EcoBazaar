const express = require("express");
// const routes = require("./routes/index");
const connectToMongoDB = require('./config/connectdb');

connectToMongoDB();

const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// Use routes from the routes/index.js file
// app.use("/", routes);

app.get('/', (req, res)=>{
    res.send("sjndn")
})

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
