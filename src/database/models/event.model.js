import { DataTypes } from 'sequelize';

// TODO : [ ] Check the description size when validating.

export default (sequelize) => {
  sequelize.define(
    'event',
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      start: { type: DataTypes.DATE, allowNull: false },
      link: { type: DataTypes.STRING(255), allowNull: true },
      description: { type: DataTypes.STRING(255), allowNull: false },
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
