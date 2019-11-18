// const getApiCallUrl = (genreIdArray) => {
//   let syear = 1990; // start year;
//   let eyear = 2019; // end year
//   let snfrate = 0; // start Netflix rating
//   let enfrate = 5; // end Netflix rating
//   let simdbrate = 0; // start IMDB rating
//   let eimdbrate = 10; // end IMDB rating
//   let genreid = genreIdArray; // genre Ids
//   let genreString = genreid
//     .reduce((value, acc) => {
//       return (acc += "," + value);
//     }, "")
//     .slice(0, -1); // genre Ids turned into string without comma
//   let vtype = "movie"; // video type: Any, Movies, Series
//   let audio = "English"; // Audio Type e.g. English, Chinese
//   let subtitle = "Any"; // Subtitle Language e.g. English, Chinese
//   let imdbvotes =
//     "gt100"; /* IMDB Votes: use gt[num] for greater than and lt[num] for less than e.g. gt1000 will give you titles with more than 1000 imdb votes */
//   let clist = "39"; // countries ID list
//   let sortby = "Rating"; // Sort Results by: Relevance, Date, Rating, Title, VideoType, FilmYear, Runtime
//   let page = 1; // Results come in groups of 100. Update this number to page through them.
//   //let downloadable = {downloadable}

//   let apiUrl = `https://unogs-unogs-v1.p.rapidapi.com/aaapi.cgi-!${syear},${eyear}-!${snfrate},${enfrate}-!${simdbrate},${eimdbrate}-!${genreString}-!${vtype}-!${audio}-!${subtitle}-!${imdbvotes}` +
//     "-!{downloadable}"
//   return apiUrl
// };

// axios
//   .get(apiUrl)
//   .then(response => {
//     //dom manipulation magic
//   })
//   .catch(err => {
//     console.log(err);
//   })