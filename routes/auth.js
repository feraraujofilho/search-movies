const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const router = express.Router();
const passport = require("passport");

/* -------------------------------------------- */

// signup

router.get("/signup", (req, res, next) => {
  res.render("auth/signup.hbs");
});

router.post("/signup", (req, res, next) => {
  const { username, password } = req.body;
  // restriction checks
  if (!username) {
    res.render("auth/signup.hbs", {
      message: "Please enter a username"
    });
    return;
  }
  if (password.length < 8) {
    res.render("auth/signup.hbs", {
      message: "Password must have min. 8 characters"
    });
    return;
  }
  User.findOne({
    username
  }).then(match => {
    if (match) {
      res.render("auth/signup.hbs", {
        message: "This username is already taken"
      });
      return;
    } else {
      // encrypt password
      bcrypt
        .genSalt()
        .then(salt => {
          return bcrypt.hash(password, salt);
        })
        .then(hash => {
          // create new user in db
          return User.create({
            username: username,
            password: hash
          });
        })
        .then(signedUpUser => {
          // log in new user with passport
          req.login(signedUpUser, err => {
            if (err) {
              next(err);
            } else {
              res.redirect("/");
            }
          });
        });
    }
  });
});

/* -------------------------------------------- */

// login local
router.get("/login", (req, res, next) => {
  res.render("auth/login.hbs");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/auth/login",
    failureFlash: true
  })
);

// login facebook
router.get("/auth/facebook", passport.authenticate("facebook"));

router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: "/login"
  }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect("/profile");
  }
);

// login google
// app.get(
//   '/google',
//   passport.authenticate('google', {
//     scope: ['profile']
//   })
// );

// app.get(
//   '/google/callback',
//   passport.authenticate('google', {
//     successRedirect: '/',
//     failureRedirect: '/auth/login'
//   })
// );

/* -------------------------------------------- */

// logout
router.get("/logout", (req, res, next) => {
  //req.logout();
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
