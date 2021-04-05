import express from 'express';
import morgan from 'morgan';

import config from './config';
import database from './database';

// import { ApolloServer, gql } from 'apollo-server-express';
// import { Sequelize } from 'sequelize';

import { Event, Label, LabelPermission, Role, Subject, User } from './models';

(async () => {
  const app = express();

  // Middlewares
  app.use(morgan('dev'));
  app.use(express.json());

  // Routes
  app.get('/', (req, res) => {
    res.json({ message: 'Welcome on the api !' });
  });

  Label.belongsToMany(User, { through: 'UserLabels' });
  User.belongsToMany(Label, { through: 'UserLabels' });

  Label.belongsToMany(User, { through: 'LabelPermissions' });
  User.belongsToMany(Label, { through: 'LabelPermissions' });

  await database.sync({ force: true });

  const users = await User.findAll();
  console.log(users);

  const PORT = config.PORT || 5000;
  app.listen(PORT, () => console.log(`App started on port ${PORT} . http://localhost:${PORT} `));
})();
