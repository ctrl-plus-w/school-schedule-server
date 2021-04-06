import { DataTypes } from 'sequelize';

export default (sequelize) => {
  sequelize.define(
    'label',
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      label_name: { type: DataTypes.STRING(255), allowNull: false },
    },
    {
      tableName: 'Label',
    }
  );
};
