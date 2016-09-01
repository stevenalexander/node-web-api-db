var express = require('express')
var shoppingList = require('../lib/shoppingList')

module.exports = function (app) {
  var route = express.Router()

  app.use('/', route)

  route.get('/', function (req, res) {
    shoppingList.getItems(function (error, items) {
      if (!error) {
        res.json(items)
      } else {
        res.status(500).json('error', {message: error.message, error: error})
      }
    })
  })

  route.post('/', function (req, res) {
    shoppingList.addItem(req.body, function (error, newItem) {
      if (!error) {
        res.status(201).json(newItem)
      } else {
        res.status(500).json('error', {message: error.message, error: error})
      }
    })
  })

  route.delete('/:id', function (req, res) {
    shoppingList.deleteItem(parseInt(req.params.id), function (error) {
      if (!error) {
        res.sendStatus(204)
      } else {
        res.status(500).json('error', {message: error.message, error: error})
      }
    })
  })
}
