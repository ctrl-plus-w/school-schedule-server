"use strict";

require("core-js/modules/es.promise.js");

var _apolloServerExpress = require("apollo-server-express");

var _express = _interopRequireDefault(require("express"));

var _cors = _interopRequireDefault(require("cors"));

var _isAuth = _interopRequireDefault(require("./middlewares/is-auth"));

var _graphql = require("./graphql");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(async () => {
  const app = (0, _express.default)(); // Middlewares
  // app.use(morgan('dev'));

  app.use(_express.default.json());
  app.use((0, _cors.default)({
    origin: '*'
  })); // TODO : [-] Handle user delete and destroy. (don't forget to fetch only records where deleted_at is null)
  // TODO : [x] User is fetched at the beggining of each Mutation.
  // TODO : [x] When creating something, verify if the unique fields aren't on the deleted_at fields.
  // TODO : [x] Verify if { include: [...models] } is compulsary on queries.
  // TODO : [x] Transform query with { where: { id: __ }} to findByPK.
  // TODO : [x] Set permissions levels.
  // TODO : [x] When deleting a label, verify if there isn't an event in the user's labels.
  // TODO : [x] When deleting a subject, verify if there isn't an event in the user's subjects.
  // Graphql

  const server = new _apolloServerExpress.ApolloServer({
    typeDefs: _graphql.typeDefs,
    resolvers: _graphql.resolvers,
    context: _isAuth.default
  });
  server.applyMiddleware({
    app
  }); // Start server.

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log("App started."));
})();
//# sourceMappingURL=index.js.map