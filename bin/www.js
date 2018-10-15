#! /usr/bin/env node

const app = require("../src/server/app")
const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
  console.log(`Hey, Listen! On port ${PORT}`)
})