const express = require("express");
const router = express.Router();
const Genre = require("../models/Genres");
const NetflixAPI = require("../public/javascripts/NetflixAPI");
const User = require("../models/User");
//const findMovieById = require("../public/javascripts/NetflixAPI");

const loginCheck = () => {
  return (req, res, next) => {
    if (req.user) {
      console.log("login check passed");
      next();
    } else {
      console.log("login check failed");
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
  console.log(req.user);
  res.render("user-profile.hbs", {
    loggedIn: req.user,
    user: req.user
  });
});

/* GET movies search */
router.get("/movies/search", loginCheck(), (req, res, next) => {
  //console.log('user:', req.session.passport.user)
  res.render("moviesSearch", { loggedIn: req.user });
});

router.post("/movies/search", (req, res, next) => {
  const selectedgenre = req.body.genre;

  Genre.find({
    genre: {
      $in: selectedgenre
    }
  })
    .then(async response => {
      console.log(response);
      const genresID = response
        .map(value => {
          return value.genreIds;
        })
        .reduce(function(a, b) {
          return a.concat(b);
        }, []);
      console.log(genresID);

      const getMovies = await NetflixAPI.getSuggestions(genresID);
      res.render("movieDetailsRoulette", { movie: getMovies });
      //res.redirect(`/movies/details/${getMovies[0].netflixid}`);
    })
    .catch(err => {
      console.log(err);
    });
});

router.post('/movies/seen/:id', (req, res, next) => {
  const movieWatched = req.params.id;
  User.find({
      _id: req.session.passport.user
    })
    .then(user => {
      let newArray = [...user[0].seen];
      newArray.push(movieWatched);
      User.findByIdAndUpdate(
          req.session.passport.user, {
            $set: {
              seen: newArray
            }
          }, {
            new: true
          })
        .then(user => {
          console.log(user)
        })
        .catch(err => {
          console.log(err);
        })
    })
});

router.post('/movies/watchlist/:id', (req, res, next) => {
  const movieToWatch = req.params.id;
  User.find({
      _id: req.session.passport.user
    })
    .then(user => {
      let newWatchlist = [...user[0].watchlist];
      newWatchlist.push(movieToWatch);
      User.findByIdAndUpdate(
          req.session.passport.user, {
            $set: {
              watchlist: newWatchlist
            }
          }, {
            new: true
          })
        .then(user => {
          console.log(user)
        })
        .catch(err => {
          console.log(err);
        })
    })
});



router.get("/movies/details/:id", async (req, res, next) => {
  try {
    const singleMovie = await NetflixAPI.findMovieById(req.params.id);
    console.log(singleMovie);
    res.render("movieDetails", {
      loggedIn: req.user,
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
