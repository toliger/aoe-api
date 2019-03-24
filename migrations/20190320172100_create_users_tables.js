exports.up = function(knex, Promise) {
  return knex.schema
    .raw("CREATE EXTENSION IF NOT EXISTS pgcrypto;")
    .createTable("users", function(table) {
      table
        .uuid("id")
        .unique()
        .defaultTo(knex.raw("gen_random_uuid()"))
        .primary();
      table.string("username").unique();
      table.string("name");
      table.string("email").unique();
      table.string("password");
      table.timestamps();
    })
    .then(() => {
      return knex("users").insert([
        {
          username: "gégé",
          name: "Gerard C",
          email: "gege@hotmail.fr",
          password:
            "$2a$08$VyPcJx6jERf0FVfhc2AuqO55WopDZt5MDYmwc/x/iz4pWqDl5cqOm",
        },
        {
          username: "claud",
          name: "Claude C",
          email: "theclaude@hotmail.fr",
          password:
            "$2a$08$h8rm1mnfV79eXKgNH0tTee7.w7J3t5lXWVNuHDY4vBpzERnczD8EW",
        },
      ]);
    });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("users");
};
