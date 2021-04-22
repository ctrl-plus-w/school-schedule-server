import database from '../database';

(async () => {
  await database.sync({ alter: true });
})();
