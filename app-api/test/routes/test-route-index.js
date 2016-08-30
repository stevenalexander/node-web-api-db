/* global describe beforeEach it */
var proxyquire = require('proxyquire')
var supertest = require('supertest')
var expect = require('chai').expect
var express = require('express')
var bodyParser = require('body-parser')

describe('index', function () {
  var error
  var item
  var items
  var request
  var called = {
    getItems: false,
    getItem: false,
    addItem: false,
    deleteItem: false
  }

  beforeEach(function () {
    // Setting up the app this way means all dependencies from app.js are explicitly defined per route file
    var app = express()
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: false }))

    var route = proxyquire('../../routes/index', {
      '../lib/shoppingList': {
        getItems: function (callback) {
          called.getItems = true
          callback(error, items)
        },
        getItem: function (id, callback) {
          called.getItem = true
          callback(error, item)
        },
        addItem: function (newItem, callback) {
          called.addItem = true
          callback(error, newItem)
        },
        deleteItem: function (id, callback) {
          called.deleteItem = true
          callback(error)
        }
      }
    })

    route(app)

    request = supertest(app)
  })

  describe('GET /', function () {
    it('should respond with a 200 and return items', function (done) {
      error = null
      items = {items: [{name: 'Milk'}]}

      request
        .get('/')
        .expect(200, function (error, response) {
          expect(error).to.be.null
          expect(response.text).to.equal(JSON.stringify(items))
          done()
        })
    })
  })

  describe('GET /1234', function () {
    it('should respond with a 200 and return item', function (done) {
      error = null
      item = {name: 'Milk'}

      request
        .get('/1234')
        .expect(200, function (error, response) {
          expect(error).to.be.null
          expect(response.text).to.equal(JSON.stringify(item))
          done()
        })
    })
  })

  describe('POST /', function () {
    it('should respond with a 201 and return item', function (done) {
      error = null
      item = {name: 'Milk'}

      request
        .post('/')
        .type('json')
        .send(JSON.stringify(item))
        .expect(201, function (error, response) {
          expect(called.addItem).to.be.true
          expect(error).to.be.null
          expect(response.text).to.equal(JSON.stringify(item))
          done()
        })
    })
  })

  describe('DELETE /1234', function () {
    it('should respond with a 204', function (done) {
      error = null

      request
        .delete('/1234')
        .expect(204, function (error, response) {
          expect(called.deleteItem).to.be.true
          expect(error).to.be.null
          done()
        })
    })
  })
})
