/* Coded by Niccolo Lampa. email:niccololampa@gmail.com */
/* TO SEE  ALL FEATURES PLEASE VIEW IN CODESANDBOX FULL/SCREEN ACTUAL MODE * /
/* PREVIEW MODE DOESN'T SHOW ALL FEATURES */
/* Run on http://localhost:8080/ after node index.js */

// for environment variables
require('dotenv/config');

const express = require('express');

const app = express();
const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

app.listen(8080);

const connection = mongoose.connect(
  process.env.MONGO_URI,
  { useNewUrlParser: true }
);

// SERVING STATIC ASSETS
app.use(express.static(`${__dirname}/styling`));

// GETTING READY FOR POST REQUEST
app.use('/', bodyParser.urlencoded({ extended: false }));

// GET PROJECT INFO
app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/project-info.html`);
});

// CREATE  A ISSUES SCHEMA
const issuesSchema = new Schema({
  issue_title: { type: String, required: true },
  created_on: { type: Date, required: true },
  updated_on: { type: Date, required: true },
  created_by: { type: String, required: true },
  assigned_to: { type: String },
  issue_text: { type: String, required: true },
  status_text: { type: String },
  open: { type: Boolean, required: true }
});

const Issues = mongoose.model('Issues', issuesSchema);

//  PROCESS POST REQUEST. WHEN URL IS SUBMITTED
app.post('/api/shorturl/', (req, res) => {
  // get the url provided in form
  const urlProvided = req.body.urlInput;
  const id = null;

  // Check validty of url. If  is not valid
  if (validateUrl(urlProvided) === false) {
    return res.json({ error: 'invalid URL' });
  }

  // Chekc if url is already in the database

  Urls.findOne({ original_url: urlProvided }, (err, data) => {
    // if data is in database
    if (data) {
      const id = data.count_id.toString();
      const shorturl = `${req.get('host')  }/a/${  id}`;
      return res.send({ original_url: urlProvided, short_url: shorturl });
    }
    // if not create in database

    console.log('creating database ');

    // Upload submitted URL to Mongo database if url is valid
    const urlUploaded = new Urls({ original_url: urlProvided });
    urlUploaded.save((err, data) => {
      if (err) return console.log(err);

      // Once uploaded find the system generated ID of url. This will be used as the shortened url.
      Urls.findOne({ original_url: urlProvided }, (err, data) => {
        if (err) return console.log(err);

        if (data) {
          const id = data.count_id.toString();
          const shorturl = `${req.get('host')  }/a/${  id}`;
          const output = { original_url: urlProvided, short_url: shorturl };
          // return processed
          res.json(output);
        }
      });

    });

  });
});

// SHORT URL REDIRECTING TO ORIGINAL URL
app.get('/a/:urlInput', (req, res) => {
  const urlInput = req.params.urlInput;
  Urls.findOne({ count_id: urlInput }, (err, data) => {
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

/* Coded by Niccolo Lampa. Email: niccololampa@gmail.com */

