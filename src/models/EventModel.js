import { DataTypes } from 'sequelize';

const EventModel = {
  UUID: { autoIncrement: true, type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
  Start: { type: DataTypes.DATE, allowNull: false },
  // TODO : Relation w/ Label and User.
};

export default EventModel;
