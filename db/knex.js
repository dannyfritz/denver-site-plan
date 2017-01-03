"use strict"
require("dotenv").config()
const knex = require("knex")
const configuration = require("../knexfile")
const environment = process.env.NODE_ENV || "development"
module.exports = knex(configuration[environment])