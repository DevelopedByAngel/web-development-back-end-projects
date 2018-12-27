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
const request = require('request');
// for put and delete form methods
const methodOverride = require('method-override');

const app = express();

//  express app to set 'pug' as the 'view-engine'.
app.set('view engine', 'pug');

app.set('trust proxy', true);

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
// CREATE  A STOCK SCHEMA
const stocksSchema = new Schema({
  stock_symbol: { type: String, required: true },
  stock_likes: { type: Array, default: [], required: true }
});

const Stocks = mongoose.model('Stocks', stocksSchema);

// ----------------------------------------------------------------------------------------
// GET HOME PAGE
app.get('/', (req, res) => {
  Stocks.find()
    .select('-__v')
    .sort({ created_on: -1 })
    .exec((err, data) => {
      if (data) {
        res.render(`${__dirname}/views/pug/index.pug`, { booksDocs: data });
      } else {
        res.render('Error Loading Home Page');
      }
    });
});

// -------------------------------------------------------------------------
//  GETTING A API REQUEST

const getStockPrice = stock => {
  const stockURL = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stock}&apikey=${
    process.env.API_KEY
  }`;

  return new Promise((resolve, reject) => {
    request(stockURL, (error, response, body) => {
      if (error) {
        reject(error);
      }
      // res.send(JSON.parse(body))
      // res.send(JSON.parse(body)["Global Quote"]["05. price"])
      resolve(JSON.parse(body));
    });
  });
};

// ----------------------------------------------------------------------------------------
// CHECK IF IP IS INCLUDED IN STOCK'S LIKES ALREADY

const ipExistCheck = (stock, ip) => {
  Stocks.findOne({ stock_symbol: stock }, (err, data) => {
    if (data) {
      if (data.stock_likes.indexOf(ip) > -1) {
        return true;
      }
      return false;
    }

    return false;
  });
};

// ----------------------------------------------------------------------------------------
//  CHECK IF STOCK IN THE DATABASE IF LIKED. IF YES UPSERT DATABASE

const updateLikesDatabase = (stock, like, ip) => {
  console.log('updating');
  // upload if existing and if liked insert IP address to stock_likes list

  const status = ipExistCheck(stock, ip);

  Stocks.updateOne(
    { stock_symbol: stock },
    like === 'true' ? { $push: { stock_likes: ip } } : {},
    { upsert: true },
    (err, data) => {
      if (err) {
        console.log(err);
      }
    }
  );
};

// ----------------------------------------------------------------------------------------
//  PROCESS GET FOR STOCK input is ID

app.get('/api/stock-prices?', (req, res) => {
  // { stock: [ 'dsf', 'aadsf' ], like: 'true' }
  let { stock, like } = req.query;
  const prices = [];
  const stockLikes = [];

  // IP

  let { ip } = req;
  if (ip.substr(0, 7) === '::ffff:') {
    ip = ip.substr(7);
  }

  // if single stock request then make it a stock a list so that stock[0] = stock for API request
  if (typeof stock === 'string') {
    stock = [stock];
  }

  getStockPrice(stock[0]).then(
    //
    response => {
      // extract current price from json(API response)
      const stockPrice = response['Global Quote']['05. price'];
      // check if stockPrice is valid(if stock is not existing in API it will be undefined)
      if (stockPrice !== undefined) {
        // call the updatelikes database function. Which will update the database if stock is liked
        updateLikesDatabase(stock[0], like, ip);
      }
      // Once database is updated find the stock symbol
      Stocks.findOne({ stock_symbol: stock[0] }, (err, data) => {
        if (data) {
          res.json({
            stockData: {
              stock: stock[0],
              price:
                stockPrice === undefined
                  ? 'Stock Symbol Not Valid'
                  : stockPrice,
              likes: data.stock_likes.length
            }
          });
        } else {
          console.log('erorro in stock fin');
        }
      });
    },

    // error in the async
    error => {
      console.log(error);
    }
  );

  // send JSON
});

/* Coded by Niccolo Lampa. Email: niccololampa@gmail.com */

// Books.findOne({ _id: req.params.id_string }, (err, data) => {
//   if (data) {
//     // res.send(data)
//     res.render(`${__dirname}/views/pug/book-info.pug`, { bookData: data })
//   }
//   // if id does not exist in database
//   else {
//     res.render(`${__dirname}/views/pug/book-info.pug`, { bookData: null })
//     // res.send("Issue Id does not exist")
//   }
// })

// // post Stock in the database
// const stockUploaded = new Stocks({ stock_symbol: stock, stock_likes: [] })
// stockUploaded.save((err, data) => {
//   if (err) {
//     res.send("upload error")
//   }
//   else {
//     // res.json({ stock_symbol: data.stock_symbol, likes: data.stock_likes.length })
//     stockLikes.push(data.stock_likes.length)
//   }
// });
