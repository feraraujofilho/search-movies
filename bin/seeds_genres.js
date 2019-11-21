// Seeds file that remove all users and create 2 new users

// To execute this seed, run from the root of the project
// $ node bin/seeds.js

const mongoose = require("mongoose");
const Genre = require("../models/Genres");

mongoose
  .connect(
    process.env.MONGODB_URI ||
      `mongodb://${process.env.DATABASE_CONNECTION}/NetflixSearch`,
    { useNewUrlParser: true }
  )
  .then(x => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch(err => {
    console.error("Error connecting to mongo", err);
  });

let genres = [
  {
    genre: "All Action",
    genreIds: [
      10673,
      10702,
      11804,
      11828,
      1192487,
      1365,
      1568,
      2125,
      2653,
      43040,
      43048,
      4344,
      46576,
      75418,
      76501,
      77232,
      788212,
      801362,
      852490,
      899,
      9584
    ]
  },
  {
    genre: "All Comedies",
    genreIds: [
      1009,
      10256,
      10375,
      105,
      10778,
      11559,
      11755,
      1208951,
      1333288,
      1402,
      1747,
      17648,
      2030,
      2700,
      31694,
      3300,
      34157,
      3519,
      3996,
      4058,
      4195,
      43040,
      4426,
      4906,
      52104,
      52140,
      52847,
      5286,
      5475,
      5610,
      56174,
      58905,
      59169,
      61132,
      61330,
      6197,
      63092,
      63115,
      6548,
      711366,
      7120,
      72407,
      7539,
      77599,
      77907,
      78163,
      78655,
      79871,
      7992,
      852492,
      869,
      89585,
      9302,
      9434,
      9702,
      9736
    ]
  },
  {
    genre: "All Dramas",
    genreIds: [
      11,
      11075,
      11714,
      1208954,
      1255,
      12994,
      13158,
      2150,
      25955,
      26009,
      2696,
      2748,
      2757,
      2893,
      29809,
      3179,
      31901,
      34204,
      3653,
      3682,
      384,
      3916,
      3947,
      4282,
      4425,
      452,
      4961,
      500,
      5012,
      52148,
      52904,
      56169,
      5763,
      58677,
      58755,
      58796,
      59064,
      6206,
      62235,
      6616,
      6763,
      68699,
      6889,
      711367,
      71591,
      72354,
      7243,
      7539,
      75459,
      76507,
      78628,
      852493,
      89804,
      9299,
      9847,
      9873
    ]
  },
  {
    genre: "All Horror",
    genreIds: [
      10695,
      10944,
      1694,
      42023,
      45028,
      48303,
      61546,
      75405,
      75804,
      75930,
      8195,
      83059,
      8711,
      89585
    ]
  },
  { genre: "All Romance", genreIds: [29281, 36103, 502675] },
  {
    genre: "All Musicals",
    genreIds: [13335, 13573, 32392, 52852, 55774, 59433, 84488, 88635]
  },
  {
    genre: "All Sci-Fi",
    genreIds: [
      108533,
      11014,
      1372,
      1492,
      1568,
      1694,
      2595,
      2729,
      3327,
      3916,
      47147,
      4734,
      49110,
      50232,
      52780,
      52849,
      5903,
      6000,
      6926,
      852491
    ]
  },
  {
    genre: "All Documentaries",
    genreIds: [
      10005,
      10105,
      10599,
      1159,
      15456,
      180,
      2595,
      26126,
      2760,
      28269,
      3652,
      3675,
      4006,
      4720,
      48768,
      49110,
      49547,
      50232,
      5161,
      5349,
      55087,
      56178,
      58710,
      60026,
      6839,
      7018,
      72384,
      77245,
      852494,
      90361,
      9875
    ]
  },
  {
    genre: "All Classics", genreIds: [
      10032,
      11093,
      13158,
      29809,
      2994,
      31273,
      31574,
      31694,
      32392,
      46553,
      46560,
      46576,
      46588,
      47147,
      47465,
      48303,
      48586,
      48744,
      76186
    ]
  }
];

Genre.deleteMany()
  .then(() => {
    return Genre.create(genres);
  })
  .then(genresCreated => {
    console.log(
      `${genresCreated.length} genres created with the following id:`
    );
    console.log(genresCreated.map(u => u._id));
  })
  .then(() => {
    // Close properly the connection to Mongoose
    mongoose.disconnect();
  })
  .catch(err => {
    mongoose.disconnect();
    throw err;
  });
