const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

let id1;

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
      chai.request(server)
        .get('/api/books')
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body, 'response should be an array');
          assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
          assert.property(res.body[0], 'title', 'Books in array should contain title');
          assert.property(res.body[0], '_id', 'Books in array should contain _id');
          id1 = res.body[0]._id;
          done();
        });
    });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({
            title: 'testing 2',
          })
          .end((err, res) => {
            const data = res.body;
            assert.equal(res.status, 200);
            assert.property(data, '_id');
            assert.property(data, 'title');
            assert.property(data, 'comments');
          });
          done();
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({ })
          .end((err, res) => {
            const data = res.text;
            assert.equal(res.status, 200);
            assert.equal(data, 'missing required field title');
          });
          done();
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
          .get('/api/books')
          .end((err, res) => {
            const data = res.body;
            assert.equal(res.status, 200);
            assert.isArray(data, 'should be an array');
            assert.property(data[0], '_id');
            assert.property(data[0], 'title');
            assert.property(data[0], 'commentcount');
          });
          done();
      });      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
          .get('/api/books/badId')
          .end((err, res) => {
            const data = res.text;
            assert.equal(res.status, 200);
            assert.equal(data, 'no book exists');
          });
          done();
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
          .get(`/api/books/${id1}`)
          .end((err, res) => {
            const data = res.body;
            assert.equal(res.status, 200);
            assert.property(data, '_id');
            assert.property(data, 'title');
            assert.property(data, 'comments');
          });
          done();
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
          .post(`/api/books/${id1}`)
          .send({
            comment: 'test'
          })
          .end((err, res) => {
            const data = res.body;
            assert.equal(res.status, 200);
            assert.property(data, '_id');
            assert.property(data, 'title');
            assert.property(data, 'comments');
            assert.isAtLeast(data.comments.length, 1);
          });
          done();
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        chai.request(server)
          .post(`/api/books/${id1}`)
          .send({ })
          .end((err, res) => {
            const data = res.text;
            assert.equal(res.status, 200);
            assert.equal(data, 'missing required field comment');
          });
          done();
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        chai.request(server)
          .post(`/api/books/1231432432432`)
          .send({
            comment: 'hey there'
          })
          .end((err, res) => {
            const data = res.text;
            assert.equal(res.status, 200);
            assert.equal(data, 'no book exists');
          });
          done();
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        chai.request(server)
          .delete(`/api/books/${id1}`)
          .end((err, res) => {
            const data = res.text;
            assert.equal(res.status, 200);
            assert.equal(data, 'delete successful');
          });
          done();
      });

      test('Test DELETE /api/books/[id] with id not in db', function(done){
        chai.request(server)
          .delete(`/api/books/badId`)
          .end((err, res) => {
            const data = res.text;
            assert.equal(res.status, 200);
            assert.equal(data, 'no book exists');
          });
          done();
      });

    });

  });

});
