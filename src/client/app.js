Vue.component("plan-grid", {
  template: "#grid-template",
  props: {
    data: Array,
    columns: Array,
    files: Array,
  },
  data: function () {
    return { search: '' }
  },
  filters: {
   capitalize: function (str) {
     return _.startCase(str)
   }
  },
  computed: {
    organizedData: function () {
      return _.sortBy(this.data, function (plan) {
        if (plan.recorded_date) {
          return -moment(plan.recorded_date).unix()
        } else if (plan.submitted_date) {
          return -moment(plan.submitted_date).unix()
        }
      })
    }
  },
  methods: {
    filterByAddress: function(entries) {
       return entries.filter(entry => _.includes(_.lowerCase(entry.address), _.lowerCase(this.search)))
    }
  },
})

let gridData = []

// bootstrap the demo
var demo = new Vue({
  el: "#demo",
  data: {
    gridColumns: ["plan_name", "address", "status", "submitted_date", "recorded_date", "num_stories", "num_units", "parking_spaces", "proposed_height", "proposed_use"],
    files: ["document"],
    gridData: gridData
  }
})

Promise.all([
  axios.get("/data/recorded"),
  axios.get("/data/under-review"),
])
  .then((responses) => demo.gridData = responses[0].data.concat(responses[1].data))
