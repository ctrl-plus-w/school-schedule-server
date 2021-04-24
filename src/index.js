import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import cors from 'cors';

import isAuth from './middlewares/is-auth';

import { resolvers, typeDefs } from './graphql';

(async () => {
  const app = express();

  // Middlewares
  // app.use(morgan('dev'));
  app.use(express.json());
  app.use(cors({ origin: '*' }));

  // TODO : [-] Handle user delete and destroy. (don't forget to fetch only records where deleted_at is null)

  // TODO : [x] User is fetched at the beggining of each Mutation.
  // TODO : [x] When creating something, verify if the unique fields aren't on the deleted_at fields.

  // TODO : [x] Verify if { include: [...models] } is compulsary on queries.
  // TODO : [x] Transform query with { where: { id: __ }} to findByPK.
  // TODO : [x] Set permissions levels.
  // TODO : [x] When deleting a label, verify if there isn't an event in the user's labels.
  // TODO : [x] When deleting a subject, verify if there isn't an event in the user's subjects.

  // Graphql
  const server = new ApolloServer({ typeDefs, resolvers, context: isAuth });
  server.applyMiddleware({ app });

  // Start server.
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`App started. Port : ${PORT}`));
})();
