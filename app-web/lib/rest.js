var request = require('request')
var apiUrl = process.env.API_URL || 'http://localhost:3001/'

module.exports = {
  getItems: function (callback) {
    request.get(apiUrl, function (error, response, data) {
      if (!error && response.statusCode === 200) {
        var json = JSON.parse(data)
        callback(null, json.items)
      } else {
        callback(error, null)
      }
    })
  },

  addItem: function (item, callback) {
    request.post({url: apiUrl, json: item}, function (error, response, item) {
      if (!error && response.statusCode === 201) {
        callback(null, item)
      } else {
        callback(error, null)
      }
    })
  },

  deleteItem: function (id, callback) {
    request.delete(apiUrl + id, function (error, response) {
      if (!error && response.statusCode === 204) {
        callback(null)
      } else {
        callback(error)
      }
    })
  }
}
