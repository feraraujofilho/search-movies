const axios = require("axios");

const getSuggestions = array => {
  let syear = 1990; // start year;
  let eyear = 2019; // end year
  let snfrate = 0; // start Netflix rating
  let enfrate = 5; // end Netflix rating
  let simdbrate = 0; // start IMDB rating
  let eimdbrate = 10; // end IMDB rating
  let genreid = array; // genre Ids
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
  return axios({
      method: "GET",
      url: "https://unogs-unogs-v1.p.rapidapi.com/aaapi.cgi",
      headers: {
        "content-type": "application/octet-stream",
        "x-rapidapi-host": "unogs-unogs-v1.p.rapidapi.com",
        "x-rapidapi-key": process.env.NETFLIX_KEY
      },
      params: {
        q: `-!${syear},${eyear}-!${snfrate},${enfrate}-!${simdbrate},${eimdbrate}-!${genreString}-!${vtype}-!${audio}-!${subtitle}-!${imdbvotes}` +
          "-!{downloadable}",
        t: "ns",
        cl: clist,
        st: "adv",
        ob: sortby,
        p: page,
        sa: "and"
      }
    })
    .then(response => {
      console.log(response.headers["x-ratelimit-requests-remaining"]);
      //console.log(response.data);
      // res.json(response.data)
      return response.data.ITEMS.slice(0, 15);
    })
    .catch(error => {
      console.log("HALLO  ", error);
    });
};

function findMovieById(id) {
  return axios({
      method: "GET",
      url: "https://unogs-unogs-v1.p.rapidapi.com/aaapi.cgi",
      headers: {
        "content-type": "application/octet-stream",
        "x-rapidapi-host": "unogs-unogs-v1.p.rapidapi.com",
        "x-rapidapi-key": process.env.NETFLIX_KEY
      },
      params: {
        t: "loadvideo",
        q: id
      }
    })
    .then(response => {
      console.log(response.headers["x-ratelimit-requests-remaining"]);
      console.log(response.data.RESULT.nfinfo)
      return response.data.RESULT
    })
    .catch(error => {
      console.log(error);
    });
}

module.exports.getSuggestions = getSuggestions;
module.exports.findMovieById = findMovieById;

/* document.querySelector("button").onclick = () => {
  getBitPrices();
}; */