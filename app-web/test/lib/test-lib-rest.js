/* global describe before it */
var expect = require('chai').expect
var sinon = require('sinon')
var proxyquire = require('proxyquire')

describe('rest', function () {
  var rest
  var request
  var requestGet
  var requestPost
  var requestDelete
  before(function () {
    requestGet = sinon.stub()
    requestPost = sinon.stub()
    requestDelete = sinon.stub()
    request = {
      get: requestGet,
      post: requestPost,
      delete: requestDelete
    }
    rest = proxyquire('../../lib/rest', {'request': request})
  })

  describe('getItems', function () {
    it('should call API and parse body', function () {
      var item = { name: 'Milk' }
      var body = JSON.stringify({ items: [item] })

      requestGet.yields(null, { statusCode: 200 }, body)

      rest.getItems(function (error, items) {
        expect(error).to.be.null
        expect(items.length).to.equal(1)
        expect(items[0].name).to.equal(item.name)
      })
    })
  })

  describe('addItem', function () {
    it('should call API with post and data', function () {
      var item = { name: 'Milk' }
      requestPost.yields(null, { statusCode: 201 })

      rest.addItem(item, function (error, newItem) {
        expect(error).to.be.null
      })
    })
  })

  describe('deleteItem', function () {
    it('should call API and delete and id', function () {
      requestDelete.withArgs(13).yields(null, { statusCode: 204 })

      rest.deleteItem(13, function (error, items) {
        expect(error).to.be.null
      })
    })
  })
})
