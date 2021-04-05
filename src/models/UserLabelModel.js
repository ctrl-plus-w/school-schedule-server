import database from '../database';

import { DataTypes } from 'sequelize';

const UserLabelModel = {
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  label_id: { type: DataTypes.INTEGER, allowNull: false },
};

export default UserLabelModel;
