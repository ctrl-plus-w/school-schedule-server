"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.event = exports.role = exports.subject = exports.user = exports.label = void 0;

var _sequelize = require("sequelize");

var _date = require("../utils/date");

var _database = _interopRequireDefault(require("../database"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var shortcutModel = /*#__PURE__*/function () {
  function shortcutModel() {
    _classCallCheck(this, shortcutModel);
  }

  _createClass(shortcutModel, null, [{
    key: "findWithCondition",
    value:
    /**
     * Find a record by its id with the given conditions.
     * @param {string} id The record id.
     * @param {object} conditions The required conditions.
     * @param {array} includes The models it should include.
     * @returns An object.
     */
    function findWithCondition(id) {
      var _this = this;

      var conditions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var includes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
      return new Promise(function (resolve, reject) {
        _database["default"].models[_this.model].findByPk(id, {
          where: conditions,
          include: includes
        }).then(resolve)["catch"](reject);
      });
    }
    /**
     * Find a record by its id.
     * @param {string} id The record id.
     * @param {array} includes The models it should include.
     * @returns An object.
     */

  }, {
    key: "find",
    value: function find(id) {
      var _this2 = this;

      var includes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      return new Promise(function (resolve, reject) {
        _this2.findWithCondition(id, {
          deleted_at: null
        }, includes).then(resolve)["catch"](reject);
      });
    }
    /**
     * Find a record by its id whether he is deleted or not.
     * @param {string} id The record id.
     * @param {array} includes The models it should include.
     * @returns An object.
     */

  }, {
    key: "findDeleted",
    value: function findDeleted(id) {
      var _this3 = this;

      var includes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      return new Promise(function (resolve, reject) {
        _this3.findWithCondition(id, includes).then(resolve)["catch"](reject);
      });
    }
    /**
     * Find a record by the given condition.
     * @param {object} conditions The required conditions.
     * @param {array} includes The models it should include.
     * @returns An object.
     */

  }, {
    key: "findBy",
    value: function findBy(conditions) {
      var _this4 = this;

      var includes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      return new Promise(function (resolve, reject) {
        _database["default"].models[_this4.model].findOne({
          where: conditions,
          include: includes
        }).then(resolve)["catch"](reject);
      });
    }
    /**
     * Find a record by its name.
     * @param {string} name The name of the record. (e.g. label > { label_name : 'name' })
     * @param {array} includes The models it shoud include.
     * @returns An object.
     */

  }, {
    key: "findByName",
    value: function findByName(name) {
      var _this5 = this;

      var includes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      return new Promise(function (resolve, reject) {
        var _this5$findBy;

        _this5.findBy((_this5$findBy = {}, _defineProperty(_this5$findBy, "".concat(_this5.model, "_name"), name), _defineProperty(_this5$findBy, "deleted_at", null), _this5$findBy), includes).then(resolve)["catch"](reject);
      });
    }
    /**
     * Get all records with the given conditions.
     * @param {object} conditions The required conditions.
     * @param {array} includes The models it should include.
     * @returns An array of objects.
     */

  }, {
    key: "findAllWithCondition",
    value: function findAllWithCondition(condition) {
      var _this6 = this;

      var includes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      return new Promise(function (resolve, reject) {
        _database["default"].models[_this6.model].findAll({
          where: condition,
          include: includes
        }).then(resolve)["catch"](reject);
      });
    }
    /**
     * Get all the records which aren't deleted.
     * @param {array} includes The models it should include.
     * @returns An array of objects.
     */

  }, {
    key: "findAll",
    value: function findAll() {
      var _this7 = this;

      var includes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      return new Promise(function (resolve, reject) {
        _this7.findAllWithCondition({
          deleted_at: null
        }, includes).then(resolve)["catch"](reject);
      });
    }
    /**
     * Get all the records whether they are deleted or not.
     * @param {array} includes The models it should include.
     * @returns An array of objects.
     */

  }, {
    key: "findAllDeleted",
    value: function findAllDeleted() {
      var _this8 = this;

      var includes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      return new Promise(function (resolve, reject) {
        _database["default"].models[_this8.model].findAll({
          include: includes
        }).then(resolve)["catch"](reject);
      });
    }
  }]);

  return shortcutModel;
}();

var label = /*#__PURE__*/function (_shortcutModel) {
  _inherits(label, _shortcutModel);

  var _super = _createSuper(label);

  function label() {
    _classCallCheck(this, label);

    return _super.apply(this, arguments);
  }

  _createClass(label, null, [{
    key: "model",
    get: function get() {
      return 'label';
    }
  }]);

  return label;
}(shortcutModel);

exports.label = label;

var user = /*#__PURE__*/function (_shortcutModel2) {
  _inherits(user, _shortcutModel2);

  var _super2 = _createSuper(user);

  function user() {
    _classCallCheck(this, user);

    return _super2.apply(this, arguments);
  }

  _createClass(user, null, [{
    key: "model",
    get: function get() {
      return 'user';
    }
    /**
     * Find a user by its id and include its role.
     * @param {string} id The user id.
     * @param {array} includes The models it should include.
     * @returns A user object.
     */

  }, {
    key: "findWithRole",
    value: function findWithRole(id) {
      var _this9 = this;

      var includes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      return new Promise(function (resolve, reject) {
        _this9.find(id, [_database["default"].models.role].concat(_toConsumableArray(includes))).then(resolve)["catch"](reject);
      });
    }
    /**
     * Find a user by its username.
     * @param {string} username The user username.
     * @param {array} includes The models it should include.
     * @returns A user object.
     */

  }, {
    key: "findByUsername",
    value: function findByUsername(username, includes) {
      var _this10 = this;

      return new Promise(function (resolve, reject) {
        _this10.findBy({
          username: username,
          deleted_at: null
        }, includes).then(resolve)["catch"](reject);
      });
    }
    /**
     * Create a user.
     * @param args The arguments provided to create the user. Must contain `username`, `full_name` and `password`.
     * @returns The created user.
     */

  }, {
    key: "create",
    value: function create(_ref) {
      var _this11 = this;

      var username = _ref.username,
          full_name = _ref.full_name,
          password = _ref.password;
      return new Promise(function (resolve, reject) {
        _database["default"].models[_this11.model].create({
          username: username,
          full_name: full_name,
          password: password
        }).then(resolve)["catch"](reject);
      });
    }
  }]);

  return user;
}(shortcutModel);

exports.user = user;

var subject = /*#__PURE__*/function (_shortcutModel3) {
  _inherits(subject, _shortcutModel3);

  var _super3 = _createSuper(subject);

  function subject() {
    _classCallCheck(this, subject);

    return _super3.apply(this, arguments);
  }

  _createClass(subject, null, [{
    key: "model",
    get: function get() {
      return 'subject';
    }
    /**
     * Create a subject.
     * @param args The arguments provided to create the subject. Must contain `subject_name` and `color`.
     * @returns The created user.
     */

  }, {
    key: "create",
    value: function create(_ref2) {
      var _this12 = this;

      var subject_name = _ref2.subject_name,
          color = _ref2.color;
      return new Promise(function (resolve, reject) {
        _database["default"].models[_this12.model].create({
          subject_name: subject_name,
          color: color
        }).then(resolve)["catch"](reject);
      });
    }
  }]);

  return subject;
}(shortcutModel);

exports.subject = subject;

var role = /*#__PURE__*/function (_shortcutModel4) {
  _inherits(role, _shortcutModel4);

  var _super4 = _createSuper(role);

  function role() {
    _classCallCheck(this, role);

    return _super4.apply(this, arguments);
  }

  _createClass(role, null, [{
    key: "model",
    get: function get() {
      return 'role';
    }
    /**
     * Create a role.
     * @param args The arguments provided to create the role. Must contain `role_name`.
     * @returns The created user.
     */

  }, {
    key: "create",
    value: function create(_ref3) {
      var _this13 = this;

      var role_name = _ref3.role_name;
      return new Promise(function (resolve, reject) {
        _database["default"].models[_this13.model].create({
          role_name: role_name
        }).then(resolve)["catch"](reject);
      });
    }
  }]);

  return role;
}(shortcutModel);

exports.role = role;

var event = /*#__PURE__*/function (_shortcutModel5) {
  _inherits(event, _shortcutModel5);

  var _super5 = _createSuper(event);

  function event() {
    _classCallCheck(this, event);

    return _super5.apply(this, arguments);
  }

  _createClass(event, null, [{
    key: "model",
    get: function get() {
      return 'event';
    }
    /**
     * Get the two week interval for the database request.
     */

  }, {
    key: "startInterval",
    get: function get() {
      var startDate = (0, _date.resetTime)(new Date());
      var endDate = new Date(new Date().setDate(new Date().getDate() + 14));
      return _defineProperty({}, _sequelize.Op.between, [startDate, endDate]);
    }
    /**
     * Get all the events which aren't deleted in the two weeks interval.
     * @param {array} includes The models it should include.
     * @returns An array of event objects.
     */

  }, {
    key: "findAll",
    value: function findAll() {
      var _this14 = this;

      var includes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var startDate = (0, _date.resetTime)(new Date());
      var endDate = new Date(new Date().setDate(new Date().getDate() + 14));
      return new Promise(function (resolve, reject) {
        return _this14.findAllWithCondition({
          start: _defineProperty({}, _sequelize.Op.between, [startDate, endDate]),
          deleted_at: null
        }, includes).then(resolve)["catch"](reject);
      });
    }
    /**
     * Get all the events which aren't deleted in the two weeks interval with the given conditions.
     * @param {object} conditions The required conditions.
     * @param {array} includes The models it should include.
     * @returns An array of event objects.
     */

  }, {
    key: "findAllBy",
    value: function findAllBy(conditions) {
      var _this15 = this;

      var includes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      return new Promise(function (resolve, reject) {
        _this15.findAllWithCondition(_objectSpread(_objectSpread({}, conditions), {}, {
          start: _this15.startInterval,
          deleted_at: null
        }), includes).then(resolve)["catch"](reject);
      });
    }
    /**
     * Get all the events where the label is in the given array which aren't deleted.
     * @param {array} labelIds The array of labels ids.
     * @param {array} includes The models it should include.
     * @returns An array of event objects.
     */

  }, {
    key: "findAllByLabelIds",
    value: function findAllByLabelIds(labelIds) {
      var _this16 = this;

      var includes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      return new Promise(function (resolve, reject) {
        _this16.findAllBy({
          labelId: _defineProperty({}, _sequelize.Op["in"], labelIds)
        }, includes).then(resolve)["catch"](reject);
      });
    }
  }]);

  return event;
}(shortcutModel);

exports.event = event;
//# sourceMappingURL=shortcut.js.map