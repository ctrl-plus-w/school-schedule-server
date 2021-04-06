import { DataTypes } from 'sequelize';

export default (sequelize) => {
  sequelize.define(
    'label',
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      label_name: { type: DataTypes.STRING(255), allowNull: false },
      label_display_name: { type: DataTypes.STRING(255), allowNull: false },
      created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, allowNull: true },
      deleted_at: { type: DataTypes.DATE, allowNull: true },
    },
    {
      tableName: 'Label',
      timestamps: false,
      underscored: true,
    }
  );
};
