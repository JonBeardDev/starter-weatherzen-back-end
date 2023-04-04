/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("observations", (table) => {
    table.increments("observation_id").primary();
    table.decimal("latitude", null, 2);
    table.decimal("longitude", null, 2);
    table.integer("sky_condition");
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("observations");
};
