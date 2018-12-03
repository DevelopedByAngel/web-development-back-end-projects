/*Coded by Niccolo Lampa. email:niccololampa@gmail.com */
/* TO SEE  ALL FEATURES PLEASE VIEW IN CODESANDBOX FULL/SCREEN ACTUAL MODE * /
/* PREVIEW MODE DOESN'T SHOW ALL FEATURES */
/* Run on http://localhost:8080/ after node index.js */

// for environment variables

// PREVIOUS DRAFT USING JUST _ID AS URL EXTENSION
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

//Serving static assets
app.use(express.static(__dirname + '/styling'));

//to ready for post-request
app.use('/', bodyParser.urlencoded({ extended: false }));

// get projectInfo for home page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/project-info.html');
});

// CREATE  A COUNTER SCHEMA
const counterSchema = new Schema({
  _id: { type: String, required: true },
  current_count: Number
});

const Counter = mongoose.model('Counter', counterSchema);

// create Url model schema
const urlSchema = new Schema({
  original_url: { type: String, required: true }
});

// upload to server
const Urls = mongoose.model('Urls', urlSchema);

// FUNCTION TO CHECK IF URL IS VALID
function validateUrl(url) {
  var pattern = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
  if (pattern.test(url)) {
    return true;
  }
  return false;
}

//  PROCESS POST REQUEST. WHEN URL IS SUBMITTED
app.post('/api/shorturl/', (req, res) => {
  // get the url provided in form
  let urlProvided = req.body.urlInput;
  let id = null;

  // Check validty of url. If  is not valid
  if (validateUrl(urlProvided) === false) {
    return res.json({ error: 'invalid URL' });
  }

  // Upload submitted URL to Mongo database if url is valid
  Urls.create({ original_url: urlProvided }),
    (err, data) => {
      if (err) return console.log(err);
    };

  // Once uploaded find the system generated ID of url. This will be used as the shortened url.
  Urls.findOne({ original_url: urlProvided }, (err, data) => {
    if (err) return console.log(err);

    if (data) {
      let id = data._id.toString();
      let shorturl = req.get('host') + '/a/' + id;
      const output = { original_url: urlProvided, short_url: shorturl };
      // return processed
      res.json(output);
    }
  });
});

// SHORT URL REDIRECTING TO ORIGINAL URL
app.get('/a/:urlInput', (req, res) => {
  const personId = req.params.urlInput;
  Urls.findById(personId, (err, data) => {
    if (err) {
      return console.log(err);
    }

    if (data) {
      const orgUrl = data.original_url;

      // redirect must include 301 request and http://
      res.redirect(301, orgUrl);
    }
  });
});

app.get('/test', (req, res) => {
  Counter.findOne({ _id: 'count_status' }, (err, data) => {
    if (err) {
      console.log('there is an error');
      return console.log(err);
    }

    if (data) {
      const orgUrl = data.current_count;
      console.log(data.current_count);
    }
  });
});

/*Coded by Niccolo Lampa. Email: niccololampa@gmail.com */

// localhost:8080/api/5c0286cdf0ab716df9eaaf40
