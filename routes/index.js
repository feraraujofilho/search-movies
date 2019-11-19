const express = require("express");
const router = express.Router();
const Genre = require("../models/Genres");
const NetflixAPI = require("../public/javascripts/NetflixAPI");
//const findMovieById = require("../public/javascripts/NetflixAPI");

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

router.post("/movies/search", (req, res, next) => {
  //res.send(req.body);
  const selectedgenre = req.body.genre;
  Genre.find({ genre: { $in: selectedgenre } })
    .then(async response => {
      console.log(response);
      const genresID = response[0].genreIds;

      const getMovies = await NetflixAPI.getSuggestions(genresID);
      //console.log("AWAIIIITED ", getMovies);
      res.render("movieDetailsRoulette", { movie: getMovies })
      //res.redirect(`/movies/details/${getMovies[0].netflixid}`);
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

router.get("/movies/details/:id", async (req, res, next) => {
  try {
    const singleMovie = await NetflixAPI.findMovieById(req.params.id);
    console.log(singleMovie)
    res.render("movieDetails", { movie: singleMovie });
  } catch (err) {
    console.log(err);
  }
});

/* router.get("/movies/details", (req, res, next) => {
  res.render("movieDetails");
});
 */
module.exports = router;
