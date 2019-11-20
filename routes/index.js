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

// GET community
router.get("/community", loginCheck(), (req, res, next) => {
  User.find({})
    .then(document => {
      res.render("community.hbs", { people: document });
    })
    .catch(err => {
      console.log(err);
    });
});

// get user profile page
router.get("/profile/:id", loginCheck(), (req, res, next) => {
  console.log(req.user);
  User.find({
    _id: req.params.id
  })
    .then(response => {
      console.log(response);
      res.render("user-profile.hbs", {
        userProfile: response[0],
        user: req.user,
        loggedIn: req.user,
        showFollow:
          req.user._id.toString() != response[0]._id.toString() &&
          req.user.follow
            .map(value => {
              return value.id;
            })
            .indexOf(response[0]._id.toString()) === -1
      });
    })
    .catch(err => {
      console.log(err);
    });
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
        .reduce(function(a, b) {
          return a.concat(b);
        }, []);
      console.log(genresID);

      const getMovies = await NetflixAPI.getSuggestions(genresID);
      User.findById(req.user._id).then(user => {
        console.log(user);
        let userMovies = user.watchlist
          .map(value => {
            return value.netflixId;
          })
          .concat(
            user.seen.map(value => {
              return value.netflixId;
            })
          );

        const filtered = getMovies.filter(value => {
          if (userMovies.indexOf(value.netflixid) < 0) {
            return value;
          }
        });
        res.render("movieDetailsRoulette", { movie: filtered });
      });
      //res.redirect(`/movies/details/${getMovies[0].netflixid}`);
    })
    .catch(err => {
      console.log(err);
    });
});

router.post("/movies/seen/", (req, res, next) => {
  const movieWatched = req.body;
  User.find({
    _id: req.session.passport.user
  }).then(user => {
    let newSeen = [...user[0].seen];
    newSeen.push(movieWatched);
    User.findByIdAndUpdate(
      req.session.passport.user,
      {
        $set: {
          seen: newSeen
        }
      },
      {
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

router.post("/movies/watchlist/", (req, res, next) => {
  const movieToWatch = req.body;
  User.find({
    _id: req.session.passport.user
  }).then(user => {
    let newWatchlist = [...user[0].watchlist];
    newWatchlist.push(movieToWatch);
    User.findByIdAndUpdate(
      req.session.passport.user,
      {
        $set: {
          watchlist: newWatchlist
        }
      },
      {
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

router.post("/profile/follow/", (req, res, next) => {
  const personToFollow = req.body;
  console.log("this is the person to follow", personToFollow);
  User.find({
    _id: req.session.passport.user
  })
    .then(user => {
      let newFriends = [...user[0].follow];
      console.log("newFriendsArray", newFriends);
      newFriends.push(personToFollow);
      console.log("user before execution", user);
      console.log("updatedArray", newFriends);
      User.findByIdAndUpdate(
        req.session.passport.user,
        {
          $set: {
            follow: newFriends
          }
        },
        {
          new: true
        }
      ).then(user => {
        console.log("user after execution", user);
        res.send(user);
      });
    })
    .catch(err => {
      console.log(err);
    });
});

module.exports = router;
