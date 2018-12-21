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

//  express app to set 'pug' as the 'view-engine'. 
app.set('view engine', 'pug')

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
app.use(express.static(`${__dirname}/public`));

// GETTING READY FOR POST REQUEST
app.use('/', bodyParser.urlencoded({ extended: false }));

// -------------------------------------------------------------------------
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
// GET HOME PAGE
app.get('/', (req, res) => {
  // console.log(Issues.find());
  Issues.find().select('-__v').sort({ created_on: -1 }).exec((err, data) => {
    if (data) {
      res.render(`${__dirname}/views/pug/index.pug`, { issuesDocs: data });
    } else {
      res.render("Error Loading Home Page")
    }
  })
});

// ----------------------------------------------------------------------------------------
//  PROCESS GET FOR ISSUE input is ID

app.get('/api/issues/:id_string', (req, res) => {

  Issues.findOne({ _id: req.params.id_string }, (err, data) => {
    if (data) {
      // res.send(data)
      res.render(`${__dirname}/views/pug/issue-info.pug`, { issueData: data })
    }
    // if id does not exist in database
    else {
      res.render(`${__dirname}/views/pug/issue-info.pug`, { issueData: null })
      // res.send("Issue Id does not exist")
    }
  })
})


// ---------------------------------------------------------------------
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
      res.send("upload error")
    }
  });

});


// ----------------------------------------------------------------------------------------
// UPDATE ISSUE USING PUT 

app.put('/api/issues/:id_string?', (req, res) => {

  const { issueId, issueTitle, createdBy, issueText, assignedTo, statusText, changeStatus } = req.body

  Issues.findOne({ _id: issueId }, (err, data) => {
    // if id exist
    if (data) {
      // create update object
      let objForUpdate = {};

      // add to the update object if user submitted any edits for the following: 
      if (issueTitle) objForUpdate.issue_title = issueTitle;
      if (createdBy) objForUpdate.created_by = createdBy;
      if (issueText) objForUpdate.issue_text = issueText;
      if (assignedTo) objForUpdate.assigned_to = assignedTo
      if (statusText) objForUpdate.status_text = statusText;
      if (changeStatus === "true") objForUpdate.open = true
      if (changeStatus === "false") objForUpdate.open = false

      // only update if objectForUpdate has greater than zero elements
      if (Object.keys(objForUpdate).length > 0) {
        // also edit updated date if user provided updates. 
        objForUpdate.updated_on = new Date();

        objForUpdate = { $set: objForUpdate }

        Issues.updateOne({ _id: issueId }, objForUpdate, (error, updated) => {
          if (updated) {
            res.redirect(`/api/issues/${data._id}`)
          }
          else {
            res.render(`${__dirname}/views/pug/update-result.pug`, { updateData: null })
          }
        })
      }
      // if no updates were provided
      else {
        res.render(`${__dirname}/views/pug/update-result.pug`, { updateData: "no-params" })
        // res.send("No update parameters provided")
      }

      // if id does not exist
    }
    else {
      res.render(`${__dirname}/views/pug/update-result.pug`, { updateData: "no-id" })
    }
  })

})

// app.put('/api/issues/a?', (req, res) => {
//   res.send("this is an update");
// })

// onsubmit="urlCreator()"
// action="/api/issues/a?_method=PUT"

// ----------------------------------------------------------------------------------------
// DELETE ISSUE METHODS

// from form
app.delete('/api/issues/:id_string?', (req, res) => {
  // res.send("test")
  Issues.deleteOne({ _id: req.body.issueId }, (err, data) => {
    // if id is existing delete issue
    if (data) {
      res.render(`${__dirname}/views/pug/issue-delete.pug`, { issueDeleted: true });
      // if id not existing
    } else {
      res.render(`${__dirname}/views/pug/issue-delete.pug`, { issueDeleted: false });
    }
  });
})



/* Coded by Niccolo Lampa. Email: niccololampa@gmail.com */

