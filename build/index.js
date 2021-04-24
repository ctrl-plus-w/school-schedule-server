"use strict";

require("regenerator-runtime/runtime");

var _apolloServerExpress = require("apollo-server-express");

var _express = _interopRequireDefault(require("express"));

var _cors = _interopRequireDefault(require("cors"));

var _isAuth = _interopRequireDefault(require("./middlewares/is-auth"));

var _graphql = require("./graphql");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
  var app, server, PORT;
  return regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          app = (0, _express["default"])(); // Middlewares
          // app.use(morgan('dev'));

          app.use(_express["default"].json());
          app.use((0, _cors["default"])({
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

          server = new _apolloServerExpress.ApolloServer({
            typeDefs: _graphql.typeDefs,
            resolvers: _graphql.resolvers,
            context: _isAuth["default"]
          });
          server.applyMiddleware({
            app: app
          }); // Start server.

          PORT = process.env.PORT || 5000;
          app.listen(PORT, function () {
            return console.log("App started on port ".concat(PORT, " . http://localhost:").concat(PORT, " "));
          });

        case 7:
        case "end":
          return _context.stop();
      }
    }
  }, _callee);
}))();
//# sourceMappingURL=index.js.map