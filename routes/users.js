const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');
require('dotenv').config();

// Use environment variable for MongoDB connection
const mongoURI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/dataAsso";

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
  },
  fullname: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  dp: {
    type: String, // URL to profile picture
    default: ''   // or some default image URL
  },
  posts: [{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Post'
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});
userSchema.plugin(plm)

module.exports = mongoose.model('User', userSchema);
