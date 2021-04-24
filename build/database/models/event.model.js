"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _sequelize = require("sequelize");

// TODO : [ ] Check the description size when validating.
var _default = function _default(sequelize) {
  sequelize.define('event', {
    id: {
      type: _sequelize.DataTypes.UUID,
      defaultValue: _sequelize.DataTypes.UUIDV4,
      primaryKey: true
    },
    start: {
      type: _sequelize.DataTypes.DATE,
      allowNull: false
    },
    link: {
      type: _sequelize.DataTypes.STRING(255),
      allowNull: true
    },
    description: {
      type: _sequelize.DataTypes.STRING(255),
      allowNull: false
    },
    obligatory: {
      type: _sequelize.DataTypes.BOOLEAN,
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
    tableName: 'Event',
    timestamps: false,
    underscored: true
  });
};

exports["default"] = _default;
//# sourceMappingURL=event.model.js.map