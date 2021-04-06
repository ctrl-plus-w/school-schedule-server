import { DataTypes } from 'sequelize';

export default (sequelize) => {
  sequelize.define(
    'subject',
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      subject_name: { type: DataTypes.STRING(255), allowNull: false },
    },
    {
      tableName: 'Subject',
    }
  );
};
