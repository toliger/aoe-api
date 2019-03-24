exports.up = function(knex, Promise) {
  return knex.schema
    .createTable("game", function(table) {
      table
        .uuid("id")
        .unique()
        .defaultTo(knex.raw("gen_random_uuid()"))
        .primary();
      table.string("name");
      /*
       * 0: lobby
       * 1: game
       */
      table.integer("state");
      table.string("players");
      table.timestamps();
    })
    .then(() => {
      return knex("game").insert([
        {
          name: "Local",
          state: 0,
          players:
            '["ace10697-c486-4dff-b641-663709ebaad4", "4b462ba3-e594-4d47-aa9d-a9ebd1450db3"]',
        },
      ]);
    });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("game");
};
