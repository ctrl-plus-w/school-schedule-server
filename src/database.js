import config from './config';

import { Sequelize } from 'sequelize';

export default new Sequelize(config.DB_NAME, config.DB_USER, config.DB_PASSWORD, {
  host: 'localhost',
  dialect: 'mysql',
});
