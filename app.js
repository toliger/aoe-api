const { ApolloServer, gql } = require("apollo-server");
const jwt = require("jsonwebtoken");
const resolvers = require("./resolvers");
const models = require("./models");

const typeDefs = gql`
  type User {
    id: String
    created_at: String
    updated_at: String
    username: String
    email: String
  }

  type Mutation {
    login(email: String!, password: String!): String
    register(email: String!, password: String!): String
  }

  type Player {
    id: String
  }

  type Query {
    me: User
    user(id: String): User
  }
`;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const header = req.headers.authorization || "";

    if (header) {
      const s = header.split(" ");
      if (s.length == 2 && s[0] == "Bearer") {
        const token = s[1];
        if (!jwt.verify(token, process.env.JWT_SECRET))
          throw new Error("Invalid token");

        const content = jwt.decode(token);
        const user = await models.User.where("id", content.uid).fetch();
        return {
          authenticated: true,
          user,
          headers: req.headers,
        };
      }
    }

    return { authenticated: false, headers: req.headers };
  },
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
