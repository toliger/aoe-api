const pg = require("knex")(require("./knexfile").development);
const bookshelf = require("bookshelf")(pg);

const User = bookshelf.Model.extend({
  tableName: "users",
});

const Game = bookshelf.Model.extend({
  tableName: "game",
});

module.exports = {
  User,
  Game,
};
