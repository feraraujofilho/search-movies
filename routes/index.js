const express = require('express');
const router = express.Router();

// home page
router.get('/', (req, res, next) => {
  res.render('index', {
    loggedIn: req.user
  });
});
const loginCheck = () => {
  return (req, res, next) => {
    if (req.user) {
      next();
    } else {
      res.redirect("/");
    }
  };
};




module.exports = router;