const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  watchlist: [String],
  seen: [String],
  follow: [String]
});

const User = mongoose.model('User', userSchema);
module.exports = User;