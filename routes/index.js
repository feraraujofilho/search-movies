const express = require("express");
const router = express.Router();
const Genre = require("../models/Genres");
const getBitPrices = require("../public/javascripts/NetflixAPI");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

/* GET movies search */
router.get("/movies/search", (req, res, next) => {
  res.render("moviesSearch");
});

router.post("/movies/search", (req, res, next) => {
  //res.send(req.body);
  const selectedgenre = req.body.genre;
  Genre.find({ genre: { $in: selectedgenre } })
    .then(response => {
      const genresID = response[0].genreIds;

      // const something = await getBitPrices(genresID);
      // console.log("ASDKlnfdskdsfn ", something);
      getBitPrices(genresID);
    })
    .catch(err => {
      console.log(err);
    });
});

module.exports = router;
