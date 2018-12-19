/* Coded by Niccolo Lampa. email:niccololampa@gmail.com */
/* TO SEE  ALL FEATURES PLEASE VIEW IN CODESANDBOX FULL/SCREEN ACTUAL MODE * /
/* PREVIEW MODE DOESN'T SHOW ALL FEATURES */
/* Run on http://localhost:8080/ after node index.js */


// for environment variables
require('dotenv/config');
const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// for put and delete form methods
const methodOverride = require('method-override')



const app = express();
// for put and delete form methods

// this will include all helmet middleware
app.use(helmet());

app.use(methodOverride('_method'))


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

// ----------------------------------------------------------------------------------------
//  PROCESS POST REQUEST. WHEN ISSUE IS SUBMITTED
app.post('/api/issues/', (req, res) => {
  // get the url provided in form
  const { issueTitle, createdBy, issueText, assignedTo, statusText } = req.body;
  const dateCreated = new Date();

  // Upload submitted Issue to Mongo database
  const issuesUploaded = new Issues({ issue_title: issueTitle, created_on: dateCreated, updated_on: dateCreated, created_by: createdBy, assigned_to: assignedTo, issue_text: issueText, status_text: statusText, open: true });
  issuesUploaded.save((err, data) => {
    if (data) {
      // return processed
      // res.json(data._id);
      // redirect to issue get issue id 
      res.redirect(`/api/issues/${data._id}`)
    }
    else {
      return console.log(err)
    }
  });

});

// ----------------------------------------------------------------------------------------
//  PROCESS GET FOR ISSUE input is ID
// 5c191acecae81f16461ae3ef

app.get('/api/issues/:id_string', (req, res) => {

  Issues.findOne({ _id: req.params.id_string }, (err, data) => {
    if (data) {
      res.send(data)
    }
    else {
      // id does not exist in database
      res.send("Issue Id does not exist")
    }
  })
})

// ----------------------------------------------------------------------------------------
// UPDATE ISSUE USING PUT 

app.put('/api/issues/:id_string?', (req, res) => {
  res.send(req.body.issue_id);
})

// app.put('/api/issues/a?', (req, res) => {
//   res.send("this is an update");
// })

// onsubmit="urlCreator()"
// action="/api/issues/a?_method=PUT"

// ----------------------------------------------------------------------------------------
// DELETE ISSUE


app.delete('/api/issues/:id_string?', (req, res) => {
  res.send(req.body.issue_id);
})


/* Coded by Niccolo Lampa. Email: niccololampa@gmail.com */

