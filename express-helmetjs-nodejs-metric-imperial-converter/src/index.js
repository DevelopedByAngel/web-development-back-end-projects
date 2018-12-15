const express = require('express');
const helmet = require('helmet');

const app = express();
const bodyParser = require('body-parser');

// this will include all helmet middleware
app.use(helmet());

app.listen(8080);

// //Serving static assets
app.use(express.static(`${__dirname}/styling`));

// to ready for post-request
app.use('/', bodyParser.urlencoded({ extended: false }));

// ------------------------------------------------------------------------
// function to collect input and split measure and unit
const inputCollector = input => {
  // get numerical measure
  const numPattern = /^.*(?=\s)/;

  const numMeasure = input.match(numPattern)[0];

  // get unit
  const unitPattern = /(?<=\s)\w+$/;

  const unit = input.match(unitPattern)[0];

  return [numMeasure, unit];
};

// ------------------------------------------------------------------------
// function to check if unit is valid
const unitChecker = unit => {
  const avail = { metric: ['l', 'kg', 'km'], imperial: ['gal', 'lbs', 'mi'] };

  if (avail.metric.indexOf(unit) >= 0) {
    return 'metric';
  }
  if (avail.imperial.indexOf(unit) >= 0) {
    return 'imperial';
  }
  return false;
};

//--------------------------------------------------------------------------
// function to convert

const converter = (measure, unit) => {
  switch (unit) {
    case 'l':
      return [measure * 0.264172, 'gal'];
    case 'kg':
      return [measure * 2.20462, 'lbs'];
    case 'km':
      return [measure * 0.621371, 'mi'];
    case 'gal':
      return [measure * 3.78541, 'l'];
    case 'lbs':
      return [measure * 0.453592, 'kg'];
    case 'mi':
      return [measure * 1.60934, 'km'];
    default:
      break;
  }
};

// -----------------------------------------------------------------------

// function to check if number is valid and convert it.

const numCheck = (num, res) => {};

// ----------------------------------------------------------------------
// get projectInfo for home page
app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/project-info.html`);
});

// ----------------------------------------------------------------------
// generating timestamp from input post-request
app.get('/api/convert?', (req, res) => {
  const inputList = inputCollector(req.query.input);

  //  if unit is invalid
  if (!unitChecker(inputList[1])) {
    res.send('invalid unit (l, kg, km, gal, lbs, mi only)');
    return;
  }

  const convertedList = converter(parseFloat(inputList[0]), inputList[1]);
  console.log(convertedList);

  res.json({
    initNum: inputList[0],
    initUnit: inputList[1],
    returnNum: convertedList[0],
    returnUnit: convertedList[1],
    string: `${inputList[0]} ${inputList[1]} converts to ${convertedList[0]} ${
      convertedList[1]
    }`
  });
});

// ----------------------------------------------------------------------

/* Coded by Niccolo Lampa. Email: niccololampa@gmail.com */

// //
// let a="2.1/4"

// a= a.split("")

// console.log(a);

// console.log(a.indexOf("/"));

// let numString='';
// let fraction;
// // console.log(numString);

// for (let i = 0; i<a.length; i++ ) {

// if (a[i]==="/"){

//   numString = numString.slice(0,-1)

//   fractionConverted =  (parseFloat(a[i-1]) / parseFloat(a[i+1]));

//   numString= numString.concat(fractionConverted);
//   i+=1  ;
//   }

// numString=numString.concat(a[i]);
// console.log(numString);

// }

// // console.log(numString);
