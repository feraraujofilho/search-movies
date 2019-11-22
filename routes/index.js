const express = require("express");
const router = express.Router();
const Genre = require("../models/Genres");
const NetflixAPI = require("../public/javascripts/NetflixAPI");
const User = require("../models/User");

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

// home page
router.get("/", (req, res, next) => {
  res.render("index", {
    loggedIn: req.user
  });
});

// community page
router.get("/community", loginCheck(), (req, res, next) => {
  User.find({})
    .then(document => {
      const seens = document.map(x => x.seen).reduce((a, b) => a.concat(b));

      const counters = seens.reduce((a, b) => {
        if (a[b.title]) a[b.title] += 1;
        else a[b.title] = 1;
        return a;
      }, {});

      const result = Object.entries(counters)
        .sort((a, b) => {
          return b[1] - a[1];
        })
        .map(value => {
          return value.slice(0, -1);
        })
        .slice(0, 5);
      console.log(result);

      console.log(document[1].seen);
      res.render("community.hbs", {
        people: document,
        loggedIn: req.user,
        bestMovies: result
      });
    })
    .catch(err => {
      console.log(err);
    });
});

// user profile page
router.get("/profile/:id", loginCheck(), (req, res, next) => {
  User.find({
    _id: req.params.id
  })
    .then(response => {
      console.log('user: ', req.user)
      console.log('userProfile: ', req.user._id.toString() === response[0]._id.toString())
      res.render("user-profile.hbs", {
        userProfile: response[0],
        user: req.user,
        loggedIn: req.user,
        showDelete: req.user._id.toString() === response[0]._id.toString(),
        showFollow: req.user._id.toString() != response[0]._id.toString() &&
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

// movie search
router.get("/movies/search", loginCheck(), (req, res, next) => {
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

      const getMovies = await NetflixAPI.getSuggestions(genresID);
      User.findById(req.user._id).then(user => {
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
        res.render("movieDetailsRoulette", {
          movie: filtered,
          loggedIn: req.user
        });
      });
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
        return;
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
        return;
      })
      .catch(err => {
        console.log(err);
      });
  });
});

router.post("/movies/watchlist/del", (req, res, next) => {
  const movieToDelete = req.body.netflixId.toString();
  User.update(
    {
      _id: req.session.passport.user
    },
    {
      $pull: {
        watchlist: {
          netflixId: movieToDelete
        }
      }
    }
  )
    .then(result => {
      return;
    })
    .catch(err => console.log(err));
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
