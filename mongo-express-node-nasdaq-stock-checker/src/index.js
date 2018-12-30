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
    .sort({ stock_symbol: 1 })
    .exec((err, data) => {
      if (data) {
        res.render(`${__dirname}/views/pug/index.pug`, { stocksDocs: data });
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

// -------------------------------------------------------------------------
// UPLOAD NEW STOCK IN THE DATABASE

const newStock = (stock, ip, like) => {
  const stockUploaded = new Stocks({
    stock_symbol: stock,
    stock_likes: like === 'true' ? [ip] : []
  });

  return new Promise((resolve, reject) => {
    stockUploaded.save((err, data) => {
      if (data) {
        resolve(console.log('new stock uploaded'));
      } else {
        reject(console.log('new stock upload failed '));
      }
    });
  });
};

// ----------------------------------------------------------------------------------------
//  UPDATE THE LIKES OF A STOCK

const updateLikesDatabase = (stock, ip) => {
  console.log('updating database');
  // upload if existing and if liked insert IP address to stock_likes list

  return new Promise((resolve, reject) => {
    Stocks.updateOne(
      { stock_symbol: stock },
      { $push: { stock_likes: ip } },
      (err, data) => {
        if (data) {
          resolve(console.log('database updated for like'));
        } else {
          reject(console.log('database update failed for like '));
        }
      }
    );
  });
};

// ----------------------------------------------------------------------------------------
// CHECK IF STOCK IS ALREADY IN THE DATABASE

const databaseCheck = (stock, ip, like) =>
  new Promise((resolve, reject) => {
    Stocks.findOne({ stock_symbol: stock }, (err, data) => {
      // if stock is in database
      if (data) {
        // if liked and IP does not exist in data yet update likes
        if (like === 'true' && data.stock_likes.indexOf(ip) === -1) {
          resolve(updateLikesDatabase(stock, ip));
        } else {
          resolve(console.log('no update required. just show prices'));
        }
      } else {
        // if stock in not in database upload
        resolve(newStock(stock, ip, like));
      }
    });
  });

// ----------------------------------------------------------------------------------------
//  PROCESS GET FOR STOCK REQUEST

app.get('/api/stock-prices?', async (req, res) => {
  const { like } = req.query;
  let { stock } = req.query;
  const stockData = {};
  const stockPrices = {};

  // IF SINGLE STOCK SUBMISSION
  // if single stock request then make it a stock a list so that stock[0] = stock for API request
  if (typeof stock === 'string') {
    stock = [stock];
  }

  // IP
  let { ip } = req;
  if (ip.substr(0, 7) === '::ffff:') {
    ip = ip.substr(7);
  }

  for (let i = 0; i < stock.length; i += 1) {
    stock[i] = stock[i].toUpperCase();
    stockData[stock[i]] = await getStockPrice(stock[i]);
    // extract current price from json(API response)
    stockPrices[stock[i]] = stockData[stock[i]]['Global Quote']['05. price'];
    // check if stockPrices is valid(if stock is not existing in API it will be undefined)
    // if stock price not exisitng in API send invalid price as JSON info
    if (stockPrices[stock[i]] === undefined) {
      res.json({
        stockData: {
          stock: stockPrices[stock[i]],
          price: 'INVALID STOCK SYMBOL'
        }
      });
      return;
    }

    // check database for stock info and update if necessary.
    await databaseCheck(stock[i], ip, like);
  }

  // Data presented if single stock
  if (stock.length === 1) {
    // Once database is updated find the stock in the updated database and then send json info.
    Stocks.findOne({ stock_symbol: stock[0] }, (err, data) => {
      if (data) {
        res.render(`${__dirname}/views/pug/stock-single-info.pug`, {
          stockData: data,
          stockPrices,
          stock
        });

        // this is the code if you want the output to be purely JSON.
        // res.json({
        //   stockData: {
        //     stock: data.stock_symbol,
        //     price: stockPrices[stock[0]],
        //     likes: data.stock_likes.length
        // });
      } else {
        // console.log('Error in fetching stock in database to show as JSON ');
        // res.send("Error in fetching stock in database to show as JSON")
        res.render(`${__dirname}/views/pug/stock-single-info.pug`, {
          stockData: null
        });
      }
    });
  }

  // Data presented if 2 stocks are submitted
  if (stock.length === 2) {
    Stocks.find({ stock_symbol: { $in: stock } }, (err, data) => {
      if (data) {
        res.render(`${__dirname}/views/pug/stock-compare-info.pug`, {
          stockData: data,
          stockPrices,
          stock
        });

        // this is the code if you want the output to be purely JSON.
        // res.json({
        //   stockData: [
        //     {
        //       stock: data[0].stock_symbol,
        //       price: stockPrices[data[0].stock_symbol],
        //       rel_likes: data[0].stock_likes.length - data[1].stock_likes.length
        //     },
        //     {
        //       stock: data[1].stock_symbol,
        //       price: stockPrices[data[1].stock_symbol],
        //       rel_likes: data[1].stock_likes.length - data[0].stock_likes.length
        //     }
        //   ]
        // });
      } else {
        // console.log('Error fetching stocks in datagbase to show as JSON');
        // res.send("Error in fetching stock in database to show as JSON")
        res.render(`${__dirname}/views/pug/stock-compare-info.pug`, {
          stockData: null
        });
      }
    });
  }
});

// ----------------------------------------------------------------------------------------
//  DELETE STOCKS FROM DATABASE

// delete all books
app.delete('/api/stocks/delete/allstocks?', (req, res) => {
  Stocks.deleteMany({}, (err, data) => {
    // if succesful in deleting entire stock database
    if (data) {
      res.render(`${__dirname}/views/pug/all-stock-delete.pug`, {
        stockDeleted: true
      });
      // if stock database delete failed
    } else {
      res.render(`${__dirname}/views/pug/all-stock-delete.pug`, {
        stockDeleted: false
      });
    }
  });
});

// delete single book
app.delete('/api/stocks/delete/:stock_string?', (req, res) => {
  Stocks.deleteOne({ stock_symbol: req.body.stockSymbol }, (err, data) => {
    // if stock exist
    if (data) {
      res.render(`${__dirname}/views/pug/stock-delete.pug`, {
        stockDeleted: true
      });
      // if stock does not exist
    } else {
      res.render(`${__dirname}/views/pug/stock-delete.pug`, {
        stockDeleted: false
      });
    }
  });
});

// ----------------------------------------------------------------------------------------
/* Coded by Niccolo Lampa. Email: niccololampa@gmail.com */
