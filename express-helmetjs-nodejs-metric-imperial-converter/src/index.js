const express = require('express');
const helmet = require('helmet')

const app = express();
const bodyParser = require('body-parser');

// this will include all helmet middleware 
app.use(helmet())


// function for time-stamp
function timestampProvider(req, res) {
  let dateInput = new Date(req.params.date_string);

  // if date string is empty trigger current date.
  if (req.params.date_string === undefined) {
    dateInput = new Date();
  }

  /* if dateInput is invalid date try converting date string to UNIX to check if it will 
  result to valid date */
  if (isNaN(dateInput.getTime())) {
    dateInput = new Date(Number(req.params.date_string));
  }

  const unixInput = dateInput.getTime();
  const utcInput = dateInput.toUTCString();

  res.json({ unix: unixInput, utc: utcInput });
}

app.listen(8080);

// //Serving static assets
app.use(express.static(`${__dirname}/styling`));

// to ready for post-request
app.use('/', bodyParser.urlencoded({ extended: false }));

// get projectInfo for home page
app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/project-info.html`);
});

// generating timestamp from input post-request
app.post('/api/timestamp/:date_string?', (req, res) =>
  timestampProvider(req, res)
);

// Json timestamp microservice
app.get('/api/timestamp/:date_string?', (req, res) =>
  timestampProvider(req, res)
);

/* Coded by Niccolo Lampa. Email: niccololampa@gmail.com */
