"use strict"
require("dotenv").config()
const Express = require("express")
const app = Express()
const routes = require("./routes")

app.use("/data", routes.data)

module.exports = app