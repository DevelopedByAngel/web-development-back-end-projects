/* Coded by Niccolo Lampa. email:niccololampa@gmail.com */
/* TO SEE  ALL FEATURES PLEASE VIEW IN CODESANDBOX FULL/SCREEN ACTUAL MODE * /
/* PREVIEW MODE DOESN'T SHOW ALL FEATURES */

/* Run on http://localhost:8080/ after node index.js */

const express = require('express');
const app = express();

// connect to port 8080
app.listen(8080);

app.set('trust proxy', true);

// app.enable('trust proxy');

// serve styling static assets
app.use(express.static(__dirname + '/styling'));

// // get projectInfo for home page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/project-info.html');
});

//to get info
app.get('/api/whoareyou/', (req, res) => {
  let ip = req.ip;
  const language = req.headers['accept-language'];
  const software = req.headers['user-agent'];

  if (ip.substr(0, 7) === '::ffff:') {
    ip = ip.substr(7);
  }
  res.json({ ipaddress: ip, language: language, software: software });
});
