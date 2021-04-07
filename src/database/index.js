import { Sequelize } from 'sequelize';

import config from '../config';
import setRelations from './extras/relations';

import eventDefiner from './models/event.model';
import labelDefiner from './models/label.model';
import roleDefiner from './models/role.model';
import subjectDefiner from './models/subject.model';
import userDefiner from './models/user.model';
import userLabelsDefiner from './models/user_labels.model';
import userSubjectsDefiner from './models/user_subjects.model';

const sequelize = new Sequelize(config.DB_NAME, config.DB_USER, config.DB_PASSWORD, {
  host: 'localhost',
  dialect: 'mysql',
  define: {
    underscored: true,
  },
});

eventDefiner(sequelize);
labelDefiner(sequelize);
roleDefiner(sequelize);
subjectDefiner(sequelize);
userDefiner(sequelize);
userLabelsDefiner(sequelize);
userSubjectsDefiner(sequelize);

setRelations(sequelize);

export default sequelize;
