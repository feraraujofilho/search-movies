const express = require("express");
const router = express.Router();
const Genre = require("../models/Genres");
const NetflixAPI = require("../public/javascripts/NetflixAPI");
//const findMovieById = require("../public/javascripts/NetflixAPI");

const loginCheck = () => {
  return (req, res, next) => {
    if (req.user) {
      console.log("login check passed")
      next();
    } else {
      console.log("login check failed")
      res.redirect("/");
    }
  };
};

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index", {
    loggedIn: req.user
  });
});

// get user profile page
router.get("/profile/", loginCheck(), (req, res, next) => {
  console.log(req.user)
  res.render('user-profile.hbs', {
    user: req.user
  })
});

/* GET movies search */
router.get("/movies/search", (req, res, next) => {
  res.render("moviesSearch");
});

router.post("/movies/search", (req, res, next) => {
  //res.send(req.body);
  const selectedgenre = req.body.genre;
  Genre.find({
      genre: {
        $in: selectedgenre
      }
    })
    .then(async response => {
      console.log(response);
      const genresID = response[0].genreIds;

      const getMovies = await NetflixAPI.getSuggestions(genresID);
      console.log("AWAIIIITED ", getMovies);
      //res.render("movieDetails", { movie: getMovies[0] });
      res.redirect(`/movies/details/${getMovies[0].netflixid}`);
    })
    .catch(err => {
      console.log(err);
    });
});


router.get("/movies/details/:id", async (req, res, next) => {
  try {
    const singleMovie = await NetflixAPI.findMovieById(req.params.id);
    console.log(singleMovie)
    res.render("movieDetails", {
      movie: singleMovie
    });
  } catch (err) {
    console.log(err);
  }
});

/* router.get("/movies/details", (req, res, next) => {
  res.render("movieDetails");
});
 */
module.exports = router;