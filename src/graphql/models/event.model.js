import { DataTypes } from 'sequelize';

export default (sequelize) => {
  sequelize.define(
    'event',
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      start: { type: DataTypes.DATE, allowNull: false },
      link: { type: DataTypes.STRING(255), allowNull: true },
    },
    {
      tableName: 'Event',
    }
  );
};
