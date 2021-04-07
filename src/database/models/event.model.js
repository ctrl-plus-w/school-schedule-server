import { DataTypes } from 'sequelize';

export default (sequelize) => {
  sequelize.define(
    'event',
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      start: { type: DataTypes.DATE, allowNull: false },
      link: { type: DataTypes.STRING(255), allowNull: true },
      obligatory: { type: DataTypes.BOOLEAN, allowNull: false },
      created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, allowNull: true },
      deleted_at: { type: DataTypes.DATE, allowNull: true },
    },
    {
      tableName: 'Event',
      timestamps: false,
      underscored: true,
    }
  );
};
