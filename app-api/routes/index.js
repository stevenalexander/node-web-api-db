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

  route.get('/:id', function (req, res) {
    shoppingList.getItem(req.param.id, function (error, item) {
      if (!error) {
        res.json(item)
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
    shoppingList.deleteItem(req.param.id, function (error) {
      if (!error) {
        res.sendStatus(204)
      } else {
        res.status(500).json('error', {message: error.message, error: error})
      }
    })
  })
}
