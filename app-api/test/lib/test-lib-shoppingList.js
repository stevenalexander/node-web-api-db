/* global describe it */
var expect = require('chai').expect
var shoppingList = require('../../lib/shoppingList')

describe('shoppingList', function () {
  describe('getItems', function () {
    it('should call DB and return items', function () {
      shoppingList.getItems(function (error, data) {
        expect(error).to.be.null
        expect(data.items.length).to.equal(1)
        expect(data.items[0].name).to.equal('Cheese')
      })
    })
  })
})
