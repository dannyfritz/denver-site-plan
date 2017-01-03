require("dotenv").config()

module.exports = {

  development: {
    client: 'pg',
    connection: "postgres://postgres@localhost/denver-site-plan",
    migrations: {
      directory: './db/migrations'
    }
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URI,
    migrations: {
      directory: './db/migrations'
    }
  }

};
