import { DataTypes } from 'sequelize';

export default (sequelize) => {
  sequelize.define(
    'user_labels',
    {
      created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, allowNull: true },
      deleted_at: { type: DataTypes.DATE, allowNull: true },
    },
    {
      tableName: 'UserLabels',
      timestamps: false,
      underscored: true,
    }
  );
};
