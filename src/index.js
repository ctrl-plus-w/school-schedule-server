import express from 'express';
import morgan from 'morgan';

import config from './config';
import database from './database';

// import { ApolloServer, gql } from 'apollo-server-express';
// import { Sequelize } from 'sequelize';

(async () => {
  const app = express();

  // Middlewares
  app.use(morgan('dev'));
  app.use(express.json());

  // Routes
  app.get('/', (req, res) => {
    res.json({ message: 'Welcome on the api !' });
  });

  // Sync database.
  await database.query('SET FOREIGN_KEY_CHECKS = 0', { raw: true }).then(() => database.sync({ force: true }));

  // Start server.
  const PORT = config.PORT || 5000;
  app.listen(PORT, () => console.log(`App started on port ${PORT} . http://localhost:${PORT} `));
})();
