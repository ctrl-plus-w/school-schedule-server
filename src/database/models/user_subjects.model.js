import { DataTypes } from 'sequelize';

export default (sequelize) => {
  sequelize.define(
    'user_subjects',
    {
      created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, allowNull: true },
      deleted_at: { type: DataTypes.DATE, allowNull: true },
    },
    {
      tableName: 'UserSubjects',
      timestamps: false,
      underscored: true,
    }
  );
};
