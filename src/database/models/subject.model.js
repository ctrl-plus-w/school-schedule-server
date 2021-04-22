import { DataTypes } from 'sequelize';

export default (sequelize) => {
  sequelize.define(
    'subject',
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      subject_name: { type: DataTypes.STRING(255), allowNull: false },
      color: { type: DataTypes.STRING(255), allowNull: false, default: 'red' },
      created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, allowNull: true },
      deleted_at: { type: DataTypes.DATE, allowNull: true },
    },
    {
      tableName: 'Subject',
      timestamps: false,
      underscored: true,
    }
  );
};
