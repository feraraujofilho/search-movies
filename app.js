require("dotenv").config();

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const favicon = require("serve-favicon");
const hbs = require("hbs");
const mongoose = require("mongoose");
const logger = require("morgan");
const path = require("path");

//session
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

//msg
const flash = require("connect-flash");

//auth
const passport = require("passport");
const LocalStrategy = require("passport-local");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
//const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("./models/User");
const bcrypt = require("bcrypt");

/* -------------------------------------------- */
hbs.registerHelper("json", (context) => {
  return JSON.parse(context)
})
// CONNECT TO DATABASE

mongoose
  .connect(
    process.env.MONGODB_URI ||
    `mongodb://${process.env.DATABASE_CONNECTION}/NetflixSearch`, {
      useNewUrlParser: true
    }
  )
  .then(x => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch(err => {
    console.error("Error connecting to mongo", err);
  });

/* -------------------------------------------- */

// EXPRESS APP SETUP

const app_name = require("./package.json").name;
const debug = require("debug")(
  `${app_name}:${path.basename(__filename).split(".")[0]}`
);
const app = express();

/* -------------------------------------------- */

// MIDDLEWARE SETUP

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: mongoose.connection
    })
  })
);
app.use(passport.initialize());
app.use(passport.session());

/* -------------------------------------------- */

// EXPRESS VIEW ENGINE SETUP

app.use(
  require("node-sass-middleware")({
    src: path.join(__dirname, "public"),
    dest: path.join(__dirname, "public"),
    sourceMap: true
  })
);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));

/* -------------------------------------------- */

// PASSPORT SETUP

// serialize
passport.serializeUser((user, done) => {
  // store user id in session
  done(null, user._id);
});

// deserialize
passport.deserializeUser((id, done) => {
  User.findById(id)
    .then(user => {
      done(null, user);
    })
    .catch(err => {
      done(err);
    });
});

// local strategy --> check for match in db
passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({
        username
      })
      .then(user => {
        // no username match
        if (!user) {
          done(null, false, {
            message: "Invalid credentials - try again"
          });
          return;
        }
        // username match
        bcrypt.compare(password, user.password).then(bool => {
          // no password match
          if (!bool) {
            done(null, false, {
              message: "Invalid credentials - try again"
            });
            return;
          }
          // password match
          done(null, user);
        });
      })
      .catch(err => {
        done(err);
      });
  })
);

// facebook strategy --> auth with passport
// passport.use(
//   new FacebookStrategy({
//       clientID: process.env.FACEBOOK_APP_ID,
//       clientSecret: process.env.FACEBOOK_APP_SECRET,
//       callbackURL: "http://localhost:3000/auth/facebook/callback"
//     },
//     function (profile, cb) {
//       User.findOrCreate({
//           facebookId: profile.id
//         },
//         function (err, user) {
//           return cb(err, user);
//         }
//       );
//     }
//   )
// );

// google strategy --> auth with passport
passport.use(
  new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID, 
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, 
      callbackURL: `http://${process.env.GOOGLEURL}/auth/google/callback` 

     
    },
    (request, accessToken, refreshToken, profile, done) => {
      User.findOne({
          googleId: profile.id
        })
        // if user found
        .then(user => {
          if (user) {
            // log in user
            done(null, user);
          } else {
            // create as new user
            User.create({
              googleId: profile.id,
              username: profile.name.givenName
            }).then(createdUser => {
              // log the new user in
              done(null, createdUser);
            });
          }
        })
        .catch(err => {
          done(err);
        });
    }
  )
);

/* -------------------------------------------- */

// REGISTER ROUTES

const index = require("./routes/index");
app.use("/", index);
const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

/* -------------------------------------------- */

// default value for title local
//app.locals.title = "Netflix Movie Search";

module.exports = app;