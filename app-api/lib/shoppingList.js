module.exports = {
  getItems: function (callback) {
    callback(null, {items: [{name: 'Cheese'}]})
  },
  getItem: function (id, callback) {
    callback(null, {name: 'Cheese'})
  },
  addItem: function (item, callback) {
    callback(null, item)
  },
  deleteItem: function (id, callback) {
    callback(null)
  }
}
