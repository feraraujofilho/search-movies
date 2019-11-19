const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  watchlist: [Number],
  seen: [Number],
  friends: []
});

const User = mongoose.model('User', userSchema);
module.exports = User;