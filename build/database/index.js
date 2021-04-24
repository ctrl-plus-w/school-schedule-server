"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _sequelize = require("sequelize");

var _config = _interopRequireDefault(require("../config"));

var _relations = _interopRequireDefault(require("./extras/relations"));

var _event = _interopRequireDefault(require("./models/event.model"));

var _label = _interopRequireDefault(require("./models/label.model"));

var _role = _interopRequireDefault(require("./models/role.model"));

var _subject = _interopRequireDefault(require("./models/subject.model"));

var _user = _interopRequireDefault(require("./models/user.model"));

var _user_labels = _interopRequireDefault(require("./models/user_labels.model"));

var _user_subjects = _interopRequireDefault(require("./models/user_subjects.model"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const sequelize = new _sequelize.Sequelize(_config.default.DB_URL, {
  host: 'localhost',
  dialect: 'mysql',
  logging: false
});
(0, _event.default)(sequelize);
(0, _label.default)(sequelize);
(0, _role.default)(sequelize);
(0, _subject.default)(sequelize);
(0, _user.default)(sequelize);
(0, _user_labels.default)(sequelize);
(0, _user_subjects.default)(sequelize);
(0, _relations.default)(sequelize);
var _default = sequelize;
exports.default = _default;
//# sourceMappingURL=index.js.map