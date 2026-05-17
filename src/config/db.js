const mongoose = require('mongoose');

const dotenv = require('dotenv');
dotenv.config();

const connectDB = async () => {
 mongoose.connect(process.env.DB_URL).then(() => {
  console.log('Connected to MongoDB');
 }).catch((err) => {
  console.error('Error connecting to MongoDB:', err);
  process.exit(1); // Exit the process with an error code
 });
};

module.exports = connectDB;