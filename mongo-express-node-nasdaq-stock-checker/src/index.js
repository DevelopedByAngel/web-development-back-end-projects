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
app.use(helmet.hidePoweredBy());
app.use(helmet.noCache());


app.use(methodOverride('_method'))

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


// // // -------------------------------------------------------------------------
// // // create a STOCK LIKE SCHEMA 

// const stockLikeSchema = new Schema({
//   comment_by: { type: String, required: true },
//   comment_text: { type: String, required: true },
//   comment_date: { type: Date, required: true }
// })

// -------------------------------------------------------------------------
// CREATE  A BOOK SCHEMA
const stocksSchema = new Schema({
  stock_symbol: { type: String, required: true },
  stock_likes: { type: Array, "default": [], required: true }
});

const Stocks = mongoose.model('Stocks', stocksSchema);


// ----------------------------------------------------------------------------------------
// GET HOME PAGE
app.get('/', (req, res) => {
  Stocks.find().select('-__v').sort({ created_on: -1 }).exec((err, data) => {
    if (data) {
      res.render(`${__dirname}/views/pug/index.pug`, { booksDocs: data });
    } else {
      res.render("Error Loading Home Page")
    }
  })
});

// ----------------------------------------------------------------------------------------
//  PROCESS GET FOR BOOK, input is ID

app.get('/api/stock-prices?', (req, res) => {
  // { stock: [ 'dsf', 'aadsf' ], like: 'true' }
  // console.log(req.query)  

  const { stock, like } = req.query;

  // if user likes stock
  if (like === "true") {
    // post Stock in the database

    const stockUploaded = new Stocks({ stock_symbol: stock, stock_likes: ['test'] })
    stockUploaded.save((err, data) => {
      if (data) {
        res.json({ stock_symbol: data.stock_symbol, likes: data.stock_likes.length })
      }
      else {
        res.send("upload error")
      }
    });
  }

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
})


// ---------------------------------------------------------------------
//  PROCESS POST REQUEST. WHEN NEW BOOK IS SUBMITTED
app.post('/api/books/', (req, res) => {
  // get the url provided in form
  const { bookTitle, bookAuthor, bookDetails } = req.body;
  const dateCreated = new Date();

  // Upload submitted Issue to Mongo database
  const booksUploaded = new Books({ book_title: bookTitle, book_author: bookAuthor, book_details: bookDetails, created_on: dateCreated });
  booksUploaded.save((err, data) => {
    if (data) {
      res.redirect(`/api/books/${data._id}`)
    }
    else {
      res.send("upload error")
    }
  });

});


// ----------------------------------------------------------------------------------------
// UPLOAD COMMENT TO BOOK USING PUT 

app.put('/api/books/:id_string?', (req, res) => {

  const { bookId, commentBy, commentText } = req.body

  const commentDate = new Date();

  const commentsData = { comment_by: commentBy, comment_text: commentText, comment_date: commentDate };

  Books.findOne({ _id: bookId }, (err, data) => {
    // if id exist
    if (data) {
      Books.update({ _id: bookId }, { $push: { book_comments: commentsData } }, (error, updated) => {
        if (updated) {
          res.redirect(`/api/books/${data._id}`)
        }
        else {
          res.render(`${__dirname}/views/pug/comment-result.pug`, { updateData: null })
        }
      })
    }
    // if id does not exist  
    else {
      res.render(`${__dirname}/views/pug/comment-result.pug`, { updateData: "no-id" })
    }
  })

})

// ----------------------------------------------------------------------------------------
// DELETE BOOKS


// delete all books
app.delete('/api/books?', (req, res) => {
  Books.deleteMany({}, (err, data) => {
    // if succesful in deleting entire library of books
    if (data) {
      res.render(`${__dirname}/views/pug/library-delete.pug`, { libraryDeleted: true });
      // if id not existing
    } else {
      res.render(`${__dirname}/views/pug/library-delete.pug`, { libraryDeleted: false });
    }
  })

})


// delete single book
app.delete('/api/books/:id_string?', (req, res) => {
  Books.deleteOne({ _id: req.body.bookId }, (err, data) => {
    // if id is existing delete book
    if (data) {
      res.render(`${__dirname}/views/pug/book-delete.pug`, { bookDeleted: true });
      // if id not existing
    } else {
      res.render(`${__dirname}/views/pug/book-delete.pug`, { bookDeleted: false });
    }
  });
});




/* Coded by Niccolo Lampa. Email: niccololampa@gmail.com */

