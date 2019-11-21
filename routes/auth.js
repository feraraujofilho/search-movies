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
  const {
    username,
    password
  } = req.body;
  console.log(username)
  console.log(password);
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
        .then(newUser => {
          // log in new user with passport
          req.login(newUser, err => {
            if (err) {
              next(err);
            } else {
              req.user = newUser;
              res.redirect = "/movies/search";
              //res.redirect(`/profile/${newUser._id}`);
            }
          });
        });
    }
  });
});

/* -------------------------------------------- */

// login local
router.get("/login", (req, res, next) => {
  console.log('login successful');
  res.render("auth/login.hbs");
});


router.post("/login", function (req, res, next) {
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.render("auth/login.hbs", {
        message: "Username or Password Incorreçct"
      });
    }
    req.logIn(user, function (err) {
      console.log(user)
      if (err) {
        return next(err);
      }
      return res.redirect("/movies/search");
      //return res.redirect("/profile/" + user._id);
    });
  })(req, res, next);
});

// login facebook
// router.get("/facebook", passport.authenticate("facebook"));

// router.get(
//   "/facebook/callback",
//   passport.authenticate("facebook", {
//     failureRedirect: "/login"
//   }),
//   function (req, res) {
//     // Successful authentication, redirect profile
//     res.redirect("/profile");
//   }
// );

//login google
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile']
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/auth/login'
  })
);

/* -------------------------------------------- */

// logout
router.get("/logout", (req, res, next) => {
  //req.logout();
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;