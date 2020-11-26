const { findByIdAndUpdate } = require('../db/model');
const Library = require('../db/model');
const ObjectId = require('mongoose').Types.ObjectId;

'use strict';

module.exports = function (app) {

  app.route('/api/books')
    .get(async (req, res) => {
      const query = (await Library.find({}).lean().exec())
        .map(book => {
          const{ _id, title, comments } = book;
          return { _id, title, commentcount: comments.length };
        });
      res.json(query);
    })
    
    .post(async (req, res) => {
      try {
        let title = req.body.title;
        if(!title) throw new Error('missing required field title');
        const doc = await Library.create({ title });
        res.json(doc);
      } catch (error) {
        res.send(error.message);
      }
    })
    
    .delete(async (req, res) => {
      try {
        await Library.deleteMany({ });
        res.send('complete delete successful');
      } catch (error) {
        res.status(500).send('Internal server error');
      }
    });



  app.route('/api/books/:id')
    .get(async (req, res) => {
      try {
        let bookid = req.params.id;
        if(!ObjectId.isValid(bookid)) throw new Error('no book exists');
        
        let book = await Library.findById(bookid).lean().exec();
        if(!book) throw new Error('no book exists');
        res.json(book);
      } catch (error) {
        res.send(error.message);
      }
    })
    
    .post(async (req, res) => {
      try {
        let bookid = req.params.id;
        let comment = req.body.comment;
        if(!comment) throw new Error('missing required field comment')

        if(!ObjectId.isValid(bookid)) throw new Error('no book exists');
        const book = await Library.findByIdAndUpdate(bookid, { $push: { comments: comment } }, { new: true, useFindAndModify: false }).lean().exec();
        if(!book) throw new Error('no book exists');

        res.json({ ...book, commentcount: book.comments.length });
      } catch (error) {
        res.send(error.message); 
      }
    })
    
    .delete(async (req, res) => {
      try {
        let bookid = req.params.id;
        if(!ObjectId.isValid(bookid)) throw new Error('no book exists');
        const book = await Library.findByIdAndDelete(bookid).lean().exec();
        if(!book) throw new Error('no book exists');
        
        res.send('delete successful');
      } catch (error) {
        res.send(error.message);
      }
    });
  
};
