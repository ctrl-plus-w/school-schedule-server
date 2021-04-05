import { DataTypes } from 'sequelize';

const EventModel = {
  id: { autoIncrement: true, type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
  start: { type: DataTypes.DATE, allowNull: false },
  label_id: { type: DataTypes.INTEGER, allowNull: false },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
};

export default EventModel;
