/*Coded by Niccolo Lampa. email:niccololampa@gmail.com */
/* TO SEE  ALL FEATURES PLEASE VIEW IN CODESANDBOX FULL/SCREEN ACTUAL MODE * /
/* PREVIEW MODE DOESN'T SHOW ALL FEATURES */
/* Run on http://localhost:8080/ after node index.js */

// https://fuschia-custard.glitch.me/api/exercise/log?userId=rkGiwsQ14

// https://fuschia-custard.glitch.me/api/exercise/add

// for environment variables
require('dotenv/config');

var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

app.listen(8080);

const connection = mongoose.connect(
  process.env.MONGO_URI,
  { useNewUrlParser: true }
);

//SERVING STATIC ASSETS
app.use(express.static(__dirname + '/styling'));

//GETTING READY FOR POST REQUEST
app.use('/', bodyParser.urlencoded({ extended: false }));

// GET PROJECT INFO
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/project-info.html');
});

// ------------------------------------------------------------------------------------------
// CREATE LOG SCHEMA

const LogSchema = new Schema({
  description: { type: String },
  duration: { type: Number },
  date: { type: Date }
});

// ------------------------------------------------------------------------------------------
// CREATE  EXERCISE SCHEMA
const UsersSchema = new Schema({
  username: { type: String, required: true },
  logs: { type: [LogSchema] }
});

const Users = mongoose.model('Users', UsersSchema);

// ------------------------------------------------------------------------------------------
// CREATE A FUNCTION TO VALIDATE IF USERNAME IS VALID

const checkNewUser = newuserInput => {
  return /\s/.test(newuserInput);
};

// ------------------------------------------------------------------------------------------
// CREATE NEW USER REQUEST
app.post('/api/exercise/new-user', (req, res) => {
  // get the username provided in the form
  const { newUserInput } = req.body;

  // check if username is valid
  userStatus = checkNewUser(newUserInput);
  if (userStatus) {
    res.send('No spaces allowed in username');
    return;
  }

  // if username is valid then upload to new User to database
  const newUser = new Users({ username: newUserInput });
  newUser.save(err => {
    if (err) return console.error(err);
    res.send({ username: newUserInput });
  });
});

// ------------------------------------------------------------------------------------------
// CREATE NEW EXERCISE FOR THE USER

app.post('/api/exercise/add', (req, res) => {
  // get the data submitted in the form
  const { usernameInput, descInput, durationInput, dateInput } = req.body;

  // create exercise data object to be pushed to the user model.
  const exerciseData = {
    description: descInput,
    duration: durationInput,
    date: new Date(dateInput)
  };

  // find username
  Users.findOne({ username: usernameInput }, (err, data) => {
    // if existing update
    if (data) {
      data.logs.push(exerciseData);
      data.save(err => {
        if (err) return console.error(err);
        res.send(exerciseData);
      });
    } else {
      // if not existing in database
      res.send('Username does not exist');
    }
  });
});

// ------------------------------------------------------------------------------------------
// QUERY THE DATABASE FOR RECORD
app.get('/api/exercise/log?', (req, res) => {
  let { usernameInput, dateStartInput, dateEndInput } = req.query;

  // get user name document
  Users.findOne({ username: usernameInput }, (err, data) => {
    // if existing get data
    if (data) {
      // extract logs array
      const logs = data.logs;

      // if user did not provide both dates return first 10 logs
      if (dateStartInput === '' && dateEndInput === '') {
        res.send({ username: usernameInput, logs: logs.slice(0, 10) });
      }
      // if provided either start date or end date
      else {
        // if no start date provided then set to earliest date possilbe
        if (dateStartInput === '') {
          dateStartInput = new Date(1970 - 01 - 01);
        }

        // if no end date provided set to latest date
        if (dateEndInput === '') {
          dateEndInput = new Date();
        }

        // then go Filter array by date
        let filteredLogs = logs.filter(exerciseLog => {
          return (
            exerciseLog.date >= new Date(dateStartInput) &&
            exerciseLog.date <= new Date(dateEndInput)
          );
        });

        // limit results to first 10 results;
        res.send({ username: usernameInput, logs: filteredLogs.slice(0, 10) });
      }
    }
    // if user is not in database
    else {
      res.send('Username does not exist');
    }
  });
});

// ------------------------------------------------------------------------------------------
// NOTES DISREGARD

// app.get('/test', (req, res) => {
//   Users.findOne({ username: 'second' }, (err, data) => {
//     // if existing update
//     if (data) {
//       res.send(data.date);
//     } else {
//       // if not existing in database
//       res.send('User not existing');
//     }
//   });
// });

// query database
// Users.find({
//   'logs.date': {
//     $gte: new Date(dateStartInput)
//     // $lte: new Date(dateEndInput)
//   },
//   username: usernameInput
// }).exec((err, data) => {
//   if (data) {
//     res.send(data);
//   }
// });
