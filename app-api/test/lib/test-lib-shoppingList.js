/* global describe beforeEach it */
var proxyquire = require('proxyquire')
var expect = require('chai').expect

describe('shoppingList', function () {
  var shoppingList
  var error
  var rows
  var fields
  var connection = {
    query: function (sql, callback) {
      callback(error, rows, fields)
    }
  }

  beforeEach(function () {
    shoppingList = proxyquire('../../lib/shoppingList', {
      'mysql': {
        createConnection: function () { return connection }
      }
    })
  })

  describe('getItems', function () {
    it('should call DB and return items', function () {
      error = null
      rows = [{name: 'Cheese'}]

      shoppingList.getItems(function (error, data) {
        expect(error).to.be.null
        expect(data.items.length).to.equal(1)
        expect(data.items[0].name).to.equal('Cheese')
      })
    })
  })
})
