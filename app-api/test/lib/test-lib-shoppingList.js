/* global describe beforeEach before it */
var proxyquire = require('proxyquire')
var expect = require('chai').expect

describe('shoppingList', function () {
  var shoppingList
  var connection

  beforeEach(function () {
    shoppingList = proxyquire('../../lib/shoppingList', {'mysql': {createConnection: function () { return connection }}})
  })

  describe('getItems', function () {
    before(function () {
      connection = {query: function (sql, callback) { callback(null, [{name: 'Cheese'}], {}) }}
    })
    it('should call DB and return items', function () {
      shoppingList.getItems(function (error, data) {
        expect(error).to.be.null
        expect(data.items.length).to.equal(1)
        expect(data.items[0].name).to.equal('Cheese')
      })
    })
  })

  describe('addItem', function () {
    var calledInsert = false

    before(function () {
      connection = {query: function (sql, post, callback) {
        calledInsert = sql.includes('INSERT') && post.name === 'Butter'
        callback(null, [{name: 'Butter'}], {})
      }}
    })
    it('should call DB INSERT and return item', function () {
      shoppingList.addItem({name: 'Butter'}, function (error, item) {
        expect(calledInsert).to.be.true
        expect(error).to.be.null
        expect(item.name).to.equal('Butter')
      })
    })
  })

  describe('deleteItem', function () {
    var calledDelete = false

    before(function () {
      connection = {query: function (sql, id, callback) {
        calledDelete = sql.includes('DELETE') && id === 13
        callback(null)
      }}
    })
    it('should call DB DELETE', function () {
      shoppingList.deleteItem(13, function (error) {
        expect(calledDelete).to.be.true
        expect(error).to.be.null
      })
    })
  })
})
