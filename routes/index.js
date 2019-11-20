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
router.get("/profile/:id", loginCheck(), (req, res, next) => {
  console.log(req.user);
  User.find({
    _id: req.params.id
  }).then(response => {
    console.log(response)
    res.render("user-profile.hbs", {
      loggedIn: req.user,
      user: req.user,
      userProfile: response[0]
    })

  })
});

/* GET movies search */
router.get("/movies/search", loginCheck(), (req, res, next) => {
  // console.log('user:', req.session.passport.user)
  res.render("moviesSearch", {
    loggedIn: req.user
  });
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
        .reduce(function (a, b) {
          return a.concat(b);
        }, []);
      console.log(genresID);

      const getMovies = await NetflixAPI.getSuggestions(genresID);
      res.render("movieDetailsRoulette", {
        movie: getMovies
      });
      //res.redirect(`/movies/details/${getMovies[0].netflixid}`);
    })
    .catch(err => {
      console.log(err);
    });
});

router.post('/movies/seen/', (req, res, next) => {
  const movieWatched = req.body;
  User.find({
      _id: req.session.passport.user
    })
    .then(user => {
      let newSeen = [...user[0].seen];
      newSeen.push(movieWatched);
      User.findByIdAndUpdate(
          req.session.passport.user, {
            $set: {
              seen: newSeen
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

router.post('/movies/watchlist/', (req, res, next) => {
  const movieToWatch = req.body;
  User.find({
    _id: req.session.passport.user
  }).then(user => {
    let newWatchlist = [...user[0].watchlist];
    newWatchlist.push(movieToWatch);
    User.findByIdAndUpdate(
        req.session.passport.user, {
          $set: {
            watchlist: newWatchlist
          }
        }, {
          new: true
        }
      )
      .then(user => {
        console.log(user);
      })
      .catch(err => {
        console.log(err);
      });
  });
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

router.post("/profile/follow/:userid", (req, res, next) => {
  User.findByIdAndUpdate(
      req.session.passport.user, {
        $push: {
          follow: req.params.userid
        }
      }, {
        new: true
      }
    )
    .then(user => {
      console.log(user);
    })
    .catch(err => {
      console.log(err);
    });
});

/* router.get("/movies/details", (req, res, next) => {
  res.render("movieDetails");
});
 */
module.exports = router;