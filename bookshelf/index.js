// Setting up the database connection
const knex = require('knex')({
    client: 'mysql',
    connection: {
      user: 'admin',
      password:'pass123',
      database:'sport_shoes'
    }
  })
  const bookshelf = require('bookshelf')(knex)
  
  module.exports = bookshelf;