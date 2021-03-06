/* global describe beforeEach it */
var proxyquire = require('proxyquire')
var sinon = require('sinon')
var supertest = require('supertest')
var expect = require('chai').expect
var express = require('express')
var bodyParser = require('body-parser')
var rest = require('../../lib/rest')

describe('index', function () {
  var request

  beforeEach(function () {
    // Setting up the app this way means all dependencies from app.js are explicitly defined per route file
    var app = express()
    app.set('views', './views')
    app.set('view engine', 'pug')
    app.use(bodyParser.urlencoded({ extended: false }))

    var route = proxyquire('../../routes/index', {
      '../../lib/rest': rest
    })

    // Inversion of control on route file
    // http://evanshortiss.com/development/javascript/2016/04/15/express-testing-using-ioc.html
    route(app)

    request = supertest(app)
  })

  describe('GET /', function () {
    it('should respond with a 500 on rest client error', function (done) {
      if (rest.getItems.restore) rest.getItems.restore()
      sinon.stub(rest, 'getItems', function (callback) {
        callback({ message: 'error' }, null)
      })

      request
        .get('/')
        .expect(500)
        .end(done())
    })

    it('should respond with a 200 and render items', function (done) {
      if (rest.getItems.restore) rest.getItems.restore()
      var getItemsStub = sinon.stub(rest, 'getItems', function (callback) {
        callback(null, [{id: 1, name: 'Milk'}])
      })

      request
        .get('/')
        .expect(200, function (error, response) {
          expect(getItemsStub.calledOnce).to.be.true
          expect(error).to.be.null
          expect(response.text).to.contain('Milk')
          done()
        })
    })
  })

  describe('POST /add', function () {
    it('should respond with a 200 and redirect', function (done) {
      var addItemStub = sinon.stub(rest, 'addItem', function (item, callback) {
        callback(null, {name: 'Cheese'})
      })

      request
        .post('/add')
        .send({name: 'Cheese'})
        .expect(302, function (error, response) {
          expect(addItemStub.calledOnce).to.be.true
          expect(error).to.be.null
          done()
        })
    })
  })

  describe('GET /delete/1234', function () {
    it('should respond with a 200 and redirect', function (done) {
      var deleteItemStub = sinon.stub(rest, 'deleteItem', function (id, callback) {
        callback(null)
      })

      request
        .get('/delete/1234')
        .expect(302, function (error, response) {
          expect(deleteItemStub.calledOnce).to.be.true
          expect(error).to.be.null
          done()
        })
    })
  })
})
