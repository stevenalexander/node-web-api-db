var mysql = require('mysql')
var connection = mysql.createConnection(process.env.DB_CONNECTION || 'mysql://root:admin@localhost/shoppinglist?debug=true')

module.exports = {
  setupList: function (callback) {
    connection.query('CREATE TABLE IF NOT EXISTS `items` ( id INT NOT NULL AUTO_INCREMENT, name VARCHAR(100) NOT NULL, PRIMARY KEY (id));', function (error, results) {
      if (error) {
        console.log(error)
      }
      callback(error)
    })
  },

  getItems: function (callback) {
    connection.query('SELECT * FROM items', function (error, rows, fields) {
      var items = []
      if (!error) {
        for (var i = 0; i < rows.length; i++) { // rows object does not work for (... in ...)
          items.push({id: rows[i].id, name: rows[i].name})
        }
      } else {
        console.log(error)
      }
      callback(error, {items: items})
    })
  },

  addItem: function (item, callback) {
    var post = { name: item.name }
    connection.query('INSERT INTO items SET ?', post, function (error, result) {
      if (error) {
        console.log(error)
      }
      callback(error, item)
    })
  },

  deleteItem: function (id, callback) {
    connection.query('DELETE FROM items WHERE items.id = ?', id, function (error, result) {
      if (error) {
        console.log(error)
      }
      callback(error)
    })
  }
}
