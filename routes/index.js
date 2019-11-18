const express = require("express");
const router = express.Router();
const Genre = require("../models/Genres");

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
  Genre.find({ genre: {$in: selectedgenre} })
    .then(response => {
      const genresID = response[0].genreIds
      res.render("movieDetails", { genres: genresID})
      //res.send(genresID);
      //let apiUrl = getApiCallUrl(genresID)
     
    })
    .catch(err => {
      console.log(err);
    });
});


module.exports = router;


const getApiCallUrl = (genreIdArray) => {
  let syear = 1990; // start year;
  let eyear = 2019; // end year
  let snfrate = 0; // start Netflix rating
  let enfrate = 5; // end Netflix rating
  let simdbrate = 0; // start IMDB rating
  let eimdbrate = 10; // end IMDB rating
  let genreid = genreIdArray; // genre Ids
  let genreString = genreid
    .reduce((value, acc) => {
      return (acc += "," + value);
    }, "")
    .slice(0, -1); // genre Ids turned into string without comma
  let vtype = "movie"; // video type: Any, Movies, Series
  let audio = "English"; // Audio Type e.g. English, Chinese
  let subtitle = "Any"; // Subtitle Language e.g. English, Chinese
  let imdbvotes =
    "gt100"; /* IMDB Votes: use gt[num] for greater than and lt[num] for less than e.g. gt1000 will give you titles with more than 1000 imdb votes */
  let clist = "39"; // countries ID list
  let sortby = "Rating"; // Sort Results by: Relevance, Date, Rating, Title, VideoType, FilmYear, Runtime
  let page = 1; // Results come in groups of 100. Update this number to page through them.
  //let downloadable = {downloadable}

  let url = `https://unogs-unogs-v1.p.rapidapi.com/aaapi.cgi-!${syear},${eyear}-!${snfrate},${enfrate}-!${simdbrate},${eimdbrate}-!${genreString}-!${vtype}-!${audio}-!${subtitle}-!${imdbvotes}` +
    "-!{downloadable}"
  return url
};

// axios
//   .get(url)
//   .then(response => {
//     //dom manipulation magic
//   })
//   .catch(err => {
//     console.log(err);
//   })