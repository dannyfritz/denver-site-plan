"use strict"
require("dotenv").config()
const dateFns = require("date-fns")
const axios = require("axios")
const Express = require("express")
const router = new Express.Router()

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
    return roundUp(feet, 2)
  }
  return parseFloat(input)
}

function dateString (input) {
  return input ? dateFns.format(new Date(input), 'MM/DD/YYYY') : ""
}

function roundUp(num, precision) {
  precision = Math.pow(10, precision)
  return Math.ceil(num * precision) / precision
}

function processResults (data) {
  return data.features.map((r) => ({
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
    recorded_date: dateString(unstringNull(r.attributes.RECORDED_DATE)),
    status: unstringNull(r.attributes.STATUS),
    submitted_date: dateString(unstringNull(r.attributes.SUBMITTED_DATE)),
  }))
}

function unwrapAxios (response) {
  return response.data
}

let cached = {
  recorded: null,
  underReview: null,
}

const CACHE_TTL = 1000  * 60 * 60 * 24

function getRecorded () {
  if (cached.recorded && cached.recorded.date > Date.now() - CACHE_TTL) {
    console.log("Hit Recorded Cache")
    return Promise.resolve(cached.recorded.value)
  }
  return axios.get(`${process.env.ENDPOINT}/0/query?f=json&where=OBJECTID%20%3E%200&returnGeometry=false&outFields=*&returnCountOnly=false&orderByFields=SUBMITTED_DATE%20DESC,RECORDED_DATE%20DESC&supportsPagination=true`)
    .then(unwrapAxios)
    .then(processResults)
    .then(function (data) {
      cached.recorded = {
        date: Date.now(),
        value: data,
      }
      return data
    })
}

function getUnderReview () {
  if (cached.underReview && cached.underReview.date > Date.now() - CACHE_TTL) {
    console.log("Hit UnderReview Cache")
    return Promise.resolve(cached.underReview.value)
  }
  return axios.get(`${process.env.ENDPOINT}/1/query?f=json&where=OBJECTID%20%3E%200&returnGeometry=false&outFields=*&returnCountOnly=false&orderByFields=SUBMITTED_DATE%20DESC,RECORDED_DATE%20DESC&supportsPagination=true`)
    .then(unwrapAxios)
    .then(processResults)
    .then(function (data) {
      cached.underReview = {
        date: Date.now(),
        value: data,
      }
      return data
    })
}

router.get("/recorded", function (request, response) {
  getRecorded()
    .then(function (data) {
      response.json(data)
    })
    .catch(function (reason) {
      response.json(reason)
    })
})

router.get("/under-review", function (request, response) {
  getUnderReview()
    .then(function (data) {
      response.json(data)
    })
    .catch(function (reason) {
      response.json(reason)
    })
})

module.exports = router