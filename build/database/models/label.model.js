"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _sequelize = require("sequelize");

var _default = sequelize => {
  sequelize.define('label', {
    id: {
      type: _sequelize.DataTypes.UUID,
      defaultValue: _sequelize.DataTypes.UUIDV4,
      primaryKey: true
    },
    label_name: {
      type: _sequelize.DataTypes.STRING(255),
      allowNull: false
    },
    // label_display_name: { type: DataTypes.STRING(255), allowNull: false },
    created_at: {
      type: _sequelize.DataTypes.DATE,
      defaultValue: _sequelize.DataTypes.NOW
    },
    updated_at: {
      type: _sequelize.DataTypes.DATE,
      allowNull: true
    },
    deleted_at: {
      type: _sequelize.DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'Label',
    timestamps: false,
    underscored: true
  });
};

exports.default = _default;
//# sourceMappingURL=label.model.js.map