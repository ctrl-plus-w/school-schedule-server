"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _sequelize = require("sequelize");

var _default = function _default(sequelize) {
  sequelize.define('role', {
    id: {
      type: _sequelize.DataTypes.UUID,
      defaultValue: _sequelize.DataTypes.UUIDV4,
      primaryKey: true
    },
    role_name: {
      type: _sequelize.DataTypes.STRING(255),
      allowNull: false
    },
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
    tableName: 'Role',
    timestamps: false,
    underscored: true
  });
};

exports["default"] = _default;
//# sourceMappingURL=role.model.js.map