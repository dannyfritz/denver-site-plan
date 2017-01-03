
exports.up = function(knex, Promise) {
  return knex.schema.createTable("plan", function (table) {
    table.string("address")
    table.string("address_notes")
    table.string("document")
    table.string("document_2")
    table.string("document_3")
    table.string("document_4")
    table.decimal("gross_floor_area", 16, 2)
    table.string("log_num")
    table.string("notes")
    table.decimal("num_stories", 16, 2)
    table.decimal("num_units", 16, 2)
    table.string("objectid")
    table.string("other_rec_num")
    table.decimal("parking_spaces", 16, 2)
    table.string("plan_name")
    table.decimal("proposed_height", 16, 2)
    table.string("proposed_use")
    table.string("reception_num")
    table.date("recorded_date")
    table.string("status")
    table.date("submitted_date")
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("plan")
};
