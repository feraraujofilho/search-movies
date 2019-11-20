const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  follow: [Object],
  watchlist: [
    {
      title: String,
      netflixId: String
    }
  ],
  seen: [
    {
      title: String,
      netflixId: String
    }
  ],
  role: {
    type: String,
    enum: ["admin", "regular"],
    default: "regular"
  }
});

const User = mongoose.model("User", userSchema);
module.exports = User;
