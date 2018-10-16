"use strict"
require("dotenv").config()
const Express = require("express")
const path = require("path")
const app = Express()
const routes = require("./routes")

app.use(Express.static(path.resolve(__dirname, "../client")))
app.use("/data", routes.data)

module.exports = app