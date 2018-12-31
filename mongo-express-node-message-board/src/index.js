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
const methodOverride = require('method-override');

// to hash password for deleting
// const bcrypt = require('bcrypt');

const app = express();

//  express app to set 'pug' as the 'view-engine'.
app.set('view engine', 'pug');

// this will include all helmet middleware
app.use(helmet());
app.use(helmet.hidePoweredBy());
app.use(helmet.noCache());

app.use(methodOverride('_method'));

const { Schema } = mongoose;

app.listen(8080);

mongoose.connect(
  process.env.MONGO_URI,
  { useNewUrlParser: true }
);

// SERVING STATIC ASSETS
app.use(express.static(`${__dirname}/public`));

// GETTING READY FOR POST REQUEST
app.use('/', bodyParser.urlencoded({ extended: false }));

// -------------------------------------------------------------------------
// CREATE A REPLIES SCHEMA

const replySchema = new Schema({
  reply_by: { type: String, required: true },
  reply_text: { type: String, required: true },
  reply_date: { type: Date, required: true },
  reply_reports: { type: Number, default: 0 },
  reply_password: { type: String, required: true }
});

const Replies = mongoose.model('replies', replySchema);

// -------------------------------------------------------------------------
// CREATE A THREAD SCHEMA
const threadSchema = new Schema({
  thread_title: { type: String, required: true },
  thread_author: { type: String, required: true },
  thread_details: { type: String, required: true },
  thread_replies: { type: [replySchema] },
  thread_reports: { type: Number, default: 0 },
  thread_date: { type: Date },
  thread_password: { type: String, required: true }
});

const Threads = mongoose.model('threads', threadSchema);

// ----------------------------------------------------------------------------------------
// GET HOME PAGE
app.get('/', (req, res) => {
  Threads.find()
    .select('-__v')
    .sort({ created_on: -1 })
    .exec((err, data) => {
      if (data) {
        res.render(`${__dirname}/views/pug/index.pug`, { threadDocs: data });
      } else {
        res.render('Error Loading Home Page');
      }
    });
});

// ----------------------------------------------------------------------------------------
//  PROCESS GET FOR BOOK, input is ID

app.get('/api/threads/:board', (req, res) => {
  Threads.findOne({ _id: req.params.board }, (err, data) => {
    if (data) {
      // res.send(data)
      res.render(`${__dirname}/views/pug/thread-info.pug`, {
        threadData: data
      });
    }
    // if id does not exist in database
    else {
      res.render(`${__dirname}/views/pug/thread-info.pug`, {
        threadData: null
      });
      // res.send("Issue Id does not exist")
    }
  });
});

// ---------------------------------------------------------------------
//  PROCESS POST REQUEST. WHEN NEW THREAD IS SUBMITTED
app.post('/api/threads/', (req, res) => {
  // get the url provided in form
  const { threadTitle, threadAuthor, threadDetails, threadPassword } = req.body;
  const dateCreated = new Date();

  // Upload submitted Issue to Mongo database
  const threadUploaded = new Threads({
    thread_title: threadTitle,
    thread_author: threadAuthor,
    thread_details: threadDetails,
    thread_date: dateCreated,
    thread_password: threadPassword
  });
  threadUploaded.save((err, data) => {
    if (data) {
      res.redirect(`/api/threads/${data._id}`);
    } else {
      res.send('upload error');
    }
  });
});

// ----------------------------------------------------------------------------------------
// UPLOAD REPORT TO THREAD USING PUT

app.put('/api/threads/:board?', (req, res) => {
  const { threadId } = req.body;

  Threads.findOne({ _id: threadId }, (err, data) => {
    // if id exist
    if (data) {
      Threads.updateOne(
        { _id: threadId },
        { $inc: { thread_reports: 1 } },
        (error, updated) => {
          if (updated) {
            res.redirect(`/api/threads/${data._id}`);
          } else {
            res.render(`${__dirname}/views/pug/report-result.pug`, {
              updateData: null
            });
          }
        }
      );
    }
    // if id does not exist
    else {
      res.render(`${__dirname}/views/pug/report-result.pug`, {
        updateData: 'no-id'
      });
    }
  });
});

// ----------------------------------------------------------------------------------------
// DELETE THREAD

app.delete('/api/threads/:board?', (req, res) => {
  const { threadId, threadPassword } = req.body;

  Threads.findOne({ _id: threadId }, (err, data) => {
    if (data) {
      if (threadPassword !== data.thread_password) {
        res.send('Password to delete thread invalid');
        return;
      }

      Threads.deleteOne({ _id: threadId }, (error, deldata) => {
        // if id is existing delete thread
        if (deldata) {
          res.render(`${__dirname}/views/pug/thread-delete.pug`, {
            threadDeleted: true
          });
          // if id not existing
        } else {
          res.render(`${__dirname}/views/pug/thread-delete.pug`, {
            threadDeleted: false
          });
        }
      });
    } else {
      res.render(`${__dirname}/views/pug/thread-delete.pug`, {
        threadDeleted: false
      });
    }
  });
});

// ---------------------------------------------------------------------
//  PROCESS POST REQUEST. WHEN NEW REPLY IS SUBMITTED
app.post('/api/replies/:board?', (req, res) => {
  // get the url provided in form
  const { replyAuthor, replyDetails, replyPassword, threadId } = req.body;
  const dateCreated = new Date();

  console.log(threadId);

  // Upload submitted Issue to Mongo database
  const replyUploaded = new Replies({
    reply_by: replyAuthor,
    reply_text: replyDetails,
    reply_date: dateCreated,
    reply_password: replyPassword
  });

  Threads.updateOne(
    { _id: threadId },
    { $push: { thread_replies: replyUploaded } },
    (error, data) => {
      if (data) {
        res.redirect(`/api/threads/${data._id}`);
      } else {
        res.send('Posting Reply Failed');
      }
    }
  );
});

// ---------------------------------------------------------------------
// UPLOAD REPORT REPLY USING PUT

app.put('/api/replies/:board?', (req, res) => {
  const { threadId, replyId } = req.body;

  Threads.findOne({ _id: threadId }, (err, data) => {
    // if id exist
    if (data) {
      Threads.updateOne(
        { _id: threadId, "thread_replies._id": },
        { $inc: { thread_replies: { _id: replyId, reply_reports: 1 } } },
        (error, updated) => {
          if (updated) {
            res.redirect(`/api/threads/${data._id}`);
          } else {
            res.render(`${__dirname}/views/pug/report-result.pug`, {
              updateData: null
            });
          }
        }
      );
    }
    // if id does not exist
    else {
      res.render(`${__dirname}/views/pug/report-result.pug`, {
        updateData: 'no-id'
      });
    }
  });
});

/* Coded by Niccolo Lampa. Email: niccololampa@gmail.com */
