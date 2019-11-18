const express = require("express");
const router = express.Router();
const Genre = require("../models/Genres");
const getBitPrices = require("../public/javascripts/NetflixAPI");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

// get user profile page
router.get("/profile", (req, res, next) => {
  res.render("user-profile.hbs");
});

/* GET movies search */
router.get("/movies/search", (req, res, next) => {
  res.render("moviesSearch");
});

router.post("/movies/search", async (req, res, next) => {
  //res.send(req.body);
  const selectedgenre = req.body.genre;
  Genre.find({ genre: { $in: selectedgenre } })
    .then(async response => {
      const genresID = response[0].genreIds;

      // const something = await getBitPrices(genresID);
      // console.log("ASDKlnfdskdsfn ", something);
      const svenja = await getBitPrices(genresID);
      console.log("AWAIIIITED ", svenja);
      res.send(svenja);
    })
    .catch(err => {
      console.log(err);
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
