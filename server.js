const app = require("./src/api/index"); // Your Express app
const mongoose = require("mongoose");
const connectDB = require("./src/config/db");

const port = 3000;
// Connect to MongoDB
connectDB(); 

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
}); 