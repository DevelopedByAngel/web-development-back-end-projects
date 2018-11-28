/*Coded by Niccolo Lampa. email:niccololampa@gmail.com */
/* TO SEE  ALL FEATURES PLEASE VIEW IN CODESANDBOX FULL/SCREEN ACTUAL MODE * /
/* PREVIEW MODE DOESN'T SHOW ALL FEATURES */

/* Run on http://localhost:8080/ after node index.js */

var express = require('express');

var bodyParser = require('body-parser');
var multer = require('multer');

//destination of database will be set here. Example multer({ dest: 'uploads/' })
//did not set it here as database provider not avail
//console warning results from destination of upload not being set.
var fileUpload = multer().single('upfile');

var app = express();

app.listen(8080);

// //Serving static assets
app.use(express.static(__dirname + '/styling'));

//to ready for post-request
app.use('/', bodyParser.urlencoded({ extended: false }));

// get projectInfo for home page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/project-info.html');
});

//generating file info from upload
app.post('/api/fileinfo', fileUpload, (req, res) => {
  if (req.file !== undefined) {
    let filename = req.file.originalname;
    let typefile = req.file.mimetype;
    let size = req.file.size;
    res.json({ filename: filename, type: typefile, size: size });
  }

  res.send('NO FILE UPLOADED');
});

/*Coded by Niccolo Lampa. Email: niccololampa@gmail.com */
