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
  const numPattern = /[^a-z]+(?=[^/d])\d|^\.*\d+\.*\d*\/*\d*(?=[a-z])|^d+\s{1}\d+\/{1}\d+(?=\s[^/d])/i; // /^.+(?=\s)/

  // /^.+(?=\s[^/d])

  let numMeasure = input.match(numPattern);
  let unit;
  // didn't input any measure
  if (numMeasure === null) {
    numMeasure = '1';
    unit = input;
  } else {
    numMeasure = numMeasure[0];

    // get unit
    const unitPattern = /(?<=\s)\w+$|(?<=\d+)\D$/;

    //

    unit = input.match(unitPattern);

    // didn't input any unit
    if (unit === null) {
      unit = '';
    } else {
      unit = unit[0];
    }
  }

  return [numMeasure, unit];
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
      return false;
  }
};

// -----------------------------------------------------------------------
// function to check if number is valid and convert it.
const numCheck = num => {
  // check if it doesnt have a fraction
  if (num.indexOf('/') === -1) {
    // makesure no space in the number
    if (num.indexOf(' ') >= 0) {
      return NaN;
    }
    // if valid decimal number or wholenumber without fraction
    return parseFloat(num);
  }

  // continue if num has fraction

  // pattern for whole number
  const wholeNumPattern = /^.*(?=\s|\.)/;

  let wholeNum = num.match(wholeNumPattern);

  // if fraction only and no whole number
  if (wholeNum === null) {
    wholeNum = 0;
  } // if it does have whole number get first element of match array
  else {
    wholeNum = wholeNum[0];
  }

  // get the characters after the decimal or space which is the fraction
  const fractionPattern = /(?<=\s|\.).*$/;

  let fraction = num.match(fractionPattern);
  // if fraction only
  if (fraction === null) {
    fraction = num;
  } else {
    fraction = fraction[0];
  }

  // split the fraction by /

  fraction = fraction.split('/', 2);

  // compute decimal
  const decimal = parseFloat(fraction[0]) / parseFloat(fraction[1]);

  // combine whole number and decimal
  const finalNum = parseFloat(wholeNum) + decimal;

  return finalNum;
};

// ----------------------------------------------------------------------
// get projectInfo for home page
app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/project-info.html`);
});

// ----------------------------------------------------------------------
// generating timestamp from input post-request
app.get('/api/convert?', (req, res) => {
  const inputList = inputCollector(req.query.input);

  const numberInput = numCheck(inputList[0]);

  console.log(numberInput);

  // check if numberInput is not number
  if (isNaN(numberInput)) {
    res.send('Please input the measure properly (eg. 1, 2 3/4 or 2.3/4)');
    return;
  }

  const convertedList = converter(numberInput, inputList[1].toLowerCase());

  //  if unit is invalid
  if (convertedList === false) {
    res.send('invalid unit (l, kg, km, gal, lbs, mi only)');
    return;
  }

  // convertedList round show only 5 decimal places

  convertedList[0] = parseFloat(convertedList[0].toFixed(5));

  // console.log('see here');
  // console.log(convertedList);

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

// 1. 5 l
// 1 1/2L
// 1. 5L
