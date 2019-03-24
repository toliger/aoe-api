const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const uuid = require("uuid/v1");
const models = require("./models");
const axios = require("axios");

const secret = process.env.JWT_SECRET;

const expose = item => Object.assign(item, item.serialize({ shallow: true }));

module.exports = {
  Query: {
    user: (_, { id }) =>
      models.User.where("id", id)
        .fetch()
        .then(expose),
    me: async (_, {}, { dataSources, authenticated, user }) => {
      if (authenticated) return expose(user);
      return null;
    },
    lobbies: async (_, {}, {}) => {
      console.log("wop");
      let lobbies = JSON.parse(
        JSON.stringify(await models.Game.where("state", 0).fetchAll()),
      );

      lobbies.forEach(e => {
        let new_players = [];
        e.players = JSON.parse(e.players);
        e.players.forEach(j => {
          let joueur = {};
          joueur.id = j;
          new_players.push(joueur);
        });
        e.players = new_players;
      });
      return lobbies;
    },
    game: async (_, { id }, {}) => {
      let game = JSON.parse(
        JSON.stringify(
          await models.Game.where({
            id,
          }).fetch(),
        ),
      );
      console.log(game);

      let new_players = [];
      game.players = JSON.parse(game.players);
      game.players.forEach(j => {
        let joueur = {};
        joueur.id = j;
        new_players.push(joueur);
      });
      game.players = new_players;

      console.log(game);
      return game;
    },
  },
  Mutation: {
    login: async (_, { email, password }, { dataSources }) => {
      try {
        const user = await models.User.where({
          email,
        }).fetch();

        if (!(await bcrypt.compare(password, user.get("password")))) {
          throw new Error("bad credentials");
        }

        return jwt.sign({ uid: user.get("id") }, secret, { expiresIn: "2h" });
      } catch (e) {
        throw new Error("login failed");
      }
    },
    register: async (_, { email, password }, { dataSources }) => {
      const hash = bcrypt.hashSync(password, 8);

      try {
        const user = await new models.User({
          username: email,
          name: email,
          email,
          password: hash,
        }).save();
        return jwt.sign({ uid: user.get("id") }, secret, { expiresIn: "2h" });
      } catch (e) {
        throw new Error("could not create user: it may already exists");
      }
    },
  },
};
