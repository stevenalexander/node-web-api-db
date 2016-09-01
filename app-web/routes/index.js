var express = require('express')
var rest = require('../lib/rest')

module.exports = function (app) {
  var route = express.Router()

  app.use('/', route)

  route.get('/', function (req, res) {
    rest.getItems(function (error, items) {
      if (!error) {
        res.render('index', { title: 'Shopping List', items })
      } else {
        res.status(500).render('error', {message: error.message, error: error})
      }
    })
  })

  route.post('/add', function (req, res) {
    var item = { name: req.body.name }
    rest.addItem(item, function (error, newItem) {
      if (!error) {
        res.redirect('/')
      } else {
        res.status(500).render('error', {message: error.message, error: error})
      }
    })
  })

  route.get('/delete/:id', function (req, res) {
    rest.deleteItem(req.params.id, function (error) {
      if (!error) {
        res.redirect('/')
      } else {
        res.status(500).render('error', {message: error.message, error: error})
      }
    })
  })
}
