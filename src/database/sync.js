import database from '../database';

(async () => {
  await database.sync({ force: true });
})();
