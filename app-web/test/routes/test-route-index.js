/* global describe beforeEach it */
var proxyquire = require('proxyquire')
var sinon = require('sinon')
var supertest = require('supertest')
var expect = require('chai').expect
var express = require('express')
var bodyParser = require('body-parser')

describe('index', function () {
  var restGetItems
  var restAddItem
  var request

  beforeEach(function () {
    restGetItems = sinon.stub()
    restAddItem = sinon.stub()

    // Setting up the app this way means all dependencies from app.js are explicitly defined per route file
    var app = express()
    app.set('views', './views')
    app.set('view engine', 'pug')
    app.use(bodyParser.urlencoded({ extended: false }))

    var route = proxyquire('../../routes/index', {
      '../../lib/rest': {
        getItems: restGetItems,
        addItem: restAddItem
      }
    })

    // Inversion of control on route file
    // http://evanshortiss.com/development/javascript/2016/04/15/express-testing-using-ioc.html
    route(app)

    request = supertest(app)
  })

  describe('GET /', function () {
    it('should respond with a 500 on rest client error', function (done) {
      restGetItems.yields({ message: 'error' }, null)

      request
        .get('/')
        .expect(500)
        .end(done())
    })

    it('should respond with a 200 and render items', function (done) {
      restGetItems.yields(null, {items: [{name: 'Milk'}]})

      request
        .get('/')
        .expect(200, function (error, response) {
          expect(error).to.be.null
          expect(response.text).to.contain('Milk')
          done()
        })
    })
  })

  describe('POST /add', function () {
    it('should respond with a 200 and redirect', function (done) {
      restAddItem.yields(null, {name: 'Cheese'})

      request
        .post('/add')
        .send({name: 'Cheese'})
        .expect(302, function (error, response) {
          expect(error).to.be.null
          done()
        })
    })
  })
})
