/*Coded by Niccolo Lampa. email:niccololampa@gmail.com */
/* TO SEE  ALL FEATURES PLEASE VIEW IN CODESANDBOX FULL/SCREEN ACTUAL MODE * /
/* PREVIEW MODE DOESN'T SHOW ALL FEATURES */

/* Run on http://localhost:8080/ after node index.js */

require('dotenv/config');

var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

app.listen(8080);

mongoose.connect(
  process.env.MONGO_URI,
  { useNewUrlParser: true }
);

// //Serving static assets
app.use(express.static(__dirname + '/styling'));

//to ready for post-request
app.use('/', bodyParser.urlencoded({ extended: false }));

// get projectInfo for home page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/project-info.html');
});

// create model schema

const urlSchema = new Schema({
  original_url: { type: String, required: true }
});

// upload to server

const Urls = mongoose.model('Urls', urlSchema);

// upload  urlprovided to database Method
// let uploadNewLink = function(urlProvided, done) {
//   const uploadedUrl = new Urls({ original_url: urlProvided });
//   uploadedUrl.save((err, data) => {
//     if (err) {
//       return done(err);
//     }
//     return done(null, data);
//   });
// };

// check validity of URL

function validateUrl(url) {
  var pattern = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
  if (pattern.test(url)) {
    alert('Url is valid');
    return true;
  }
  alert('Url is not valid!');
  return false;
}

app.post('/api/shorturl/', (req, res) => {
  // get the url provided in form
  const urlProvided = req.body.urlInput;
  let id = null;

  // if url is not valid
  if (validateUrl(urlProvided)) {
    res.json({ error: 'invalid URL' });
  }

  // uploadNewLink(urlProvided);

  Urls.create({ original_url: urlProvided }),
    (err, data) => {
      if (err) return handleError(err);
    };

  // find url Provided id in database
  id = Urls.findOne({ original_url: urlProvided }, (err, data) => {
    if (err) return handleError(err);

    if (data) {
      console.log(data._id);
      let id = data._id;
      return;
    }
  });

  let shorturl = urlProvided + '/' + id;

  const output = { original_url: urlProvided, shorturl: shorturl };
  res.json(output);
});

/*Coded by Niccolo Lampa. Email: niccololampa@gmail.com */
