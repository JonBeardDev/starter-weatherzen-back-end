/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.table("observations", (table) =>{
      table.decimal("air_temperature", null, 2);
      table.string("air_temperature_unit");
    })
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = function(knex) {
    return knex.schema.table("observations", (table) => {
      table.dropColumn("air_temperature");
      table.dropColumn("air_temperature_unit");
    })
  };
