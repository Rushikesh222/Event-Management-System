
const mongoose = require('mongoose');
const dcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: [true, 'Email already exists'],
    lowercase: true,
    trim: true,
    match: [/\S+@\S+\.\S+/, 'Please use a valid email address']     
  },
    password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false // Exclude password from query results by default
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
   role: {
    type: String,
    enum: ["organizer", "customer"],
    default: "customer"
  }

}, { timestamps: true });

userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return
  }
    try {
    const salt = await dcrypt.genSalt(10);
    this.password = await dcrypt.hash(this.password, salt);
  } catch (err) {
   console.error('Error hashing password:', err);
   throw err; // Rethrow the error to prevent saving the user
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await dcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema); 

