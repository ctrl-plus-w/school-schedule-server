import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

import config from './config';
import database from './database';

import isAuth from './middlewares/is-auth';

import { resolvers, typeDefs } from './graphql';
import { Op } from 'sequelize';

const syncDatabase = async (config) => {
  if (!config?.sync) return;

  await database.query('SET FOREIGN_KEY_CHECKS = 0', { raw: true }).then(() => database.sync(config?.alter ? { alter: true } : { force: true }));

  if (!config?.alter && config?.seed) {
    await database.models.role.bulkCreate([
      { role_name: 'Élève' },
      { role_name: 'Enseignant' },
      { role_name: 'Surveillant' },
      { role_name: 'CPE' },
      { role_name: 'Admin' },
    ]);

    await database.models.subject.bulkCreate([
      { subject_name: 'Histoire' },
      { subject_name: 'Français' },
      { subject_name: 'Anglais' },
      { subject_name: 'SpéNSI' },
      { subject_name: 'SpéMath' },
    ]);

    await database.models.label.bulkCreate([
      { label_name: '2nd1' },
      { label_name: '2nd2' },
      { label_name: '2nd3' },
      { label_name: '2nd4' },
      { label_name: '2nd5' },
      { label_name: '2nd6' },
      { label_name: '1ère1' },
      { label_name: '1ère2' },
      { label_name: '1ère3' },
      { label_name: '1ère4' },
      { label_name: '1ère5' },
      { label_name: '1ère6' },
    ]);

    await database.models.user.bulkCreate([
      {
        username: 'llaudrain',
        full_name: 'Lukas Laudrain',
        password: '$2b$12$VMk6a36OSY/jZ2ZXAAyPLO7zcMlrGauErY15JNWgdNm3j2.hdnyqS',
      },
      {
        username: 'elaurent',
        full_name: 'Eric Laurent',
        password: '$2b$12$VMk6a36OSY/jZ2ZXAAyPLO7zcMlrGauErY15JNWgdNm3j2.hdnyqS',
      },
      {
        username: 'admin',
        full_name: 'admin',
        password: '$2b$12$VMk6a36OSY/jZ2ZXAAyPLO7zcMlrGauErY15JNWgdNm3j2.hdnyqS',
      },
    ]);
  }
};

(async () => {
  const app = express();

  // Middlewares
  app.use(morgan('dev'));
  app.use(express.json());
  app.use(cors({ origin: '*' }));

  // TODO : [-] Handle user delete and destroy. (don't forget to fetch only records where deleted_at is null)

  // TODO : [ ] User is fetched at the beggining of each Mutation.
  // TODO : [ ] When creating something, verify if the unique fields aren't on the deleted_at fields.

  // TODO : [x] Verify if { include: [...models] } is compulsary on queries.
  // TODO : [x] Transform query with { where: { id: __ }} to findByPK.
  // TODO : [ ] Set permissions levels, base 10.
  // TODO : [x] When deleting a label, verify if there isn't an event in the user's labels.
  // TODO : [ ] When deleting a subject, verify if there isn't an event in the user's subjects.

  // Graphql
  const server = new ApolloServer({ typeDefs, resolvers, context: isAuth });
  server.applyMiddleware({ app });

  // Sync database.
  await syncDatabase({
    sync: false,
    alter: false,
    seed: true,
  });

  // Start server.
  const PORT = config.PORT || 5000;
  app.listen(PORT, () => console.log(`App started on port ${PORT} . http://localhost:${PORT} `));
})();
