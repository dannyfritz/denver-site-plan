"use strict"
const knex = require("../db/knex")
const fs = require("mz/fs")
const path = require("path")

function unstringNull (input) {
  if (input === "Null") {
    return null
  }
  return input
}

function heightString (input) {
  if (input === null) {
    return null
  }
  if (/\d+(\.?\d*)*'$/.test(input)) {
    return input.replace("'", "")
  }
  if (/\d+(\.?\d*)*'.\d+"$/.test(input)) {
    const parts = input.split("'")
    const inches = parts[1]
    const feet = parseFloat(parts[0]) + Math.abs(parseFloat(inches))/12
    return feet
  }
  return parseFloat(input)
}

function processResults (results) {
  return results.map((r) => ({
    address: unstringNull(r.attributes.ADDRESS),
    address_notes: unstringNull(r.attributes.ADDRESS_NOTES),
    document: unstringNull(r.attributes.DOCUMENT),
    document_2: unstringNull(r.attributes.DOCUMENT_2),
    document_3: unstringNull(r.attributes.DOCUMENT_3),
    document_4: unstringNull(r.attributes.DOCUMENT_4),
    gross_floor_area: unstringNull(r.attributes.GROSS_FLOOR_AREA),
    log_num: unstringNull(r.attributes.LOG_NUM),
    notes: unstringNull(r.attributes.NOTES),
    num_stories: unstringNull(r.attributes.NUM_STORIES),
    num_units: unstringNull(r.attributes.NUM_UNITS),
    objectid: unstringNull(r.attributes.OBJECTID),
    other_rec_num: unstringNull(r.attributes.OTHER_REC_NUM),
    parking_spaces: unstringNull(r.attributes.PARKING_SPACES),
    plan_name: unstringNull(r.attributes.PLAN_NAME),
    proposed_height: heightString(unstringNull(r.attributes.PROPOSED_HEIGHT)),
    proposed_use: unstringNull(r.attributes.PROPOSED_USE),
    reception_num: unstringNull(r.attributes.RECEPTION_NUM),
    recorded_date: unstringNull(r.attributes.RECORDED_DATE),
    status: unstringNull(r.attributes.STATUS),
    submitted_date: unstringNull(r.attributes.SUBMITTED_DATE),
  }))
}

const plan = knex("plan").delete()
  .then(function () {
    return Promise.all([
      fs.readFile(path.resolve(__dirname, "../fixtures/data0.json"), "utf8"),
      fs.readFile(path.resolve(__dirname, "../fixtures/data1.json"), "utf8"),
    ])
  })
  .then(function (data) {
    return data.map(JSON.parse)
  })
  .then(function (data) {
    return data.map((d) => processResults(d.results))
  })
  .then(function (plans) {
    return Promise.all(plans.map((p) => knex("plan").insert(p)))
  })
  .catch(function (reason) {
    console.error(reason)
    process.exit(reason.errno)
  })
  .then(function () {
    process.exit(0)
  })