/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var mongoose = require('mongoose')
const MONGODB_CONNECTION_STRING = process.env.DB;
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});
mongoose.connect(MONGODB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology:true})

const bookSchema = mongoose.Schema
const bookModel = new bookSchema({
  title: {type: String},
  comments: [String],
  commentcount: {type: Number, default: 0}
})
var book = mongoose.model('book', bookModel)


module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      book.find({},'_id title commentcount',function(err,data){
        res.json(data)
      })
    
    })
    
    .post(function (req, res){
      var title = req.body.title;
      //response will contain new book object including atleast _id and title
     console.log(title) 
     if (title=="") {
        res.send("Please enter a title")
      }
      else {
      var newbook = new book({
        title: title
      })
      newbook.save(function(err,data) {
        if (err) {res.json(err)}
        else{
          res.json({_id: data._id, title: data.title})
        }
      })
      }    
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      book.deleteMany({},function(err,res){
        if (err) {res.send('issues deleting')}
        else{res.send('complete delete successful')}
      })
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      book.findOne({_id:bookid}, function(err,data){
        if (err) {res.send('no book exists')}
        else{
          res.json(data)
        }
      })
    })
    
    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
      //json res format same as .get

      book.findById(bookid, function(err, data) {
        if (err) {res.send('no book exists') }
        else{
          data.comments.push(comment)
          data.commentcount++
          data.save(function(err, savedreturn) {
            if (err) res.json(err)
            else{res.json({title: data.title, _id:data._id, comments:data.comments})}
          })
        }
      })
    
    })
    
    .delete(function(req, res){
      var bookid = req.params.id;
      book.findOneAndDelete({_id:bookid}, function(err, data){
        if (err) {res.send('no book exists')}
        else {res.send('delete successful')}
      })
      //if successful response will be 'delete successful'
    });
  
};
