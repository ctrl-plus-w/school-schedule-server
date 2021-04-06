import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import morgan from 'morgan';

import config from './config';
import database from './database';

import { resolvers, typeDefs } from './graphql/schema';

(async () => {
  const app = express();

  // Middlewares
  app.use(morgan('dev'));
  app.use(express.json());

  const server = new ApolloServer({ typeDefs, resolvers });
  server.applyMiddleware({ app });

  // Sync database.
  // await database.query('SET FOREIGN_KEY_CHECKS = 0', { raw: true }).then(() => database.sync({ force: true }));

  // Start server.
  const PORT = config.PORT || 5000;
  app.listen(PORT, () => console.log(`App started on port ${PORT} . http://localhost:${PORT} `));
})();
