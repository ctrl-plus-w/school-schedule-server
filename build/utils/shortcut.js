"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.event = exports.role = exports.subject = exports.user = exports.label = void 0;

require("core-js/modules/es.promise.js");

require("core-js/modules/web.dom-collections.iterator.js");

var _sequelize = require("sequelize");

var _date = require("../utils/date");

var _database = _interopRequireDefault(require("../database"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class shortcutModel {
  /**
   * Find a record by its id with the given conditions.
   * @param {string} id The record id.
   * @param {object} conditions The required conditions.
   * @param {array} includes The models it should include.
   * @returns An object.
   */
  static findWithCondition(id) {
    let conditions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    let includes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
    return new Promise((resolve, reject) => {
      _database.default.models[this.model].findByPk(id, {
        where: conditions,
        include: includes
      }).then(resolve).catch(reject);
    });
  }
  /**
   * Find a record by its id.
   * @param {string} id The record id.
   * @param {array} includes The models it should include.
   * @returns An object.
   */


  static find(id) {
    let includes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    return new Promise((resolve, reject) => {
      this.findWithCondition(id, {
        deleted_at: null
      }, includes).then(resolve).catch(reject);
    });
  }
  /**
   * Find a record by its id whether he is deleted or not.
   * @param {string} id The record id.
   * @param {array} includes The models it should include.
   * @returns An object.
   */


  static findDeleted(id) {
    let includes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    return new Promise((resolve, reject) => {
      this.findWithCondition(id, includes).then(resolve).catch(reject);
    });
  }
  /**
   * Find a record by the given condition.
   * @param {object} conditions The required conditions.
   * @param {array} includes The models it should include.
   * @returns An object.
   */


  static findBy(conditions) {
    let includes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    return new Promise((resolve, reject) => {
      _database.default.models[this.model].findOne({
        where: conditions,
        include: includes
      }).then(resolve).catch(reject);
    });
  }
  /**
   * Find a record by its name.
   * @param {string} name The name of the record. (e.g. label > { label_name : 'name' })
   * @param {array} includes The models it shoud include.
   * @returns An object.
   */


  static findByName(name) {
    let includes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    return new Promise((resolve, reject) => {
      this.findBy({
        ["".concat(this.model, "_name")]: name,
        deleted_at: null
      }, includes).then(resolve).catch(reject);
    });
  }
  /**
   * Get all records with the given conditions.
   * @param {object} conditions The required conditions.
   * @param {array} includes The models it should include.
   * @returns An array of objects.
   */


  static findAllWithCondition(condition) {
    let includes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    return new Promise((resolve, reject) => {
      _database.default.models[this.model].findAll({
        where: condition,
        include: includes
      }).then(resolve).catch(reject);
    });
  }
  /**
   * Get all the records which aren't deleted.
   * @param {array} includes The models it should include.
   * @returns An array of objects.
   */


  static findAll() {
    let includes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    return new Promise((resolve, reject) => {
      this.findAllWithCondition({
        deleted_at: null
      }, includes).then(resolve).catch(reject);
    });
  }
  /**
   * Get all the records whether they are deleted or not.
   * @param {array} includes The models it should include.
   * @returns An array of objects.
   */


  static findAllDeleted() {
    let includes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    return new Promise((resolve, reject) => {
      _database.default.models[this.model].findAll({
        include: includes
      }).then(resolve).catch(reject);
    });
  }

}

class label extends shortcutModel {
  static get model() {
    return 'label';
  }

}

exports.label = label;

class user extends shortcutModel {
  static get model() {
    return 'user';
  }
  /**
   * Find a user by its id and include its role.
   * @param {string} id The user id.
   * @param {array} includes The models it should include.
   * @returns A user object.
   */


  static findWithRole(id) {
    let includes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    return new Promise((resolve, reject) => {
      this.find(id, [_database.default.models.role, ...includes]).then(resolve).catch(reject);
    });
  }
  /**
   * Find a user by its username.
   * @param {string} username The user username.
   * @param {array} includes The models it should include.
   * @returns A user object.
   */


  static findByUsername(username, includes) {
    return new Promise((resolve, reject) => {
      this.findBy({
        username: username,
        deleted_at: null
      }, includes).then(resolve).catch(reject);
    });
  }
  /**
   * Create a user.
   * @param args The arguments provided to create the user. Must contain `username`, `full_name` and `password`.
   * @returns The created user.
   */


  static create(_ref) {
    let {
      username,
      full_name,
      password
    } = _ref;
    return new Promise((resolve, reject) => {
      _database.default.models[this.model].create({
        username,
        full_name,
        password
      }).then(resolve).catch(reject);
    });
  }

}

exports.user = user;

class subject extends shortcutModel {
  static get model() {
    return 'subject';
  }
  /**
   * Create a subject.
   * @param args The arguments provided to create the subject. Must contain `subject_name` and `color`.
   * @returns The created user.
   */


  static create(_ref2) {
    let {
      subject_name,
      color
    } = _ref2;
    return new Promise((resolve, reject) => {
      _database.default.models[this.model].create({
        subject_name,
        color
      }).then(resolve).catch(reject);
    });
  }

}

exports.subject = subject;

class role extends shortcutModel {
  static get model() {
    return 'role';
  }
  /**
   * Create a role.
   * @param args The arguments provided to create the role. Must contain `role_name`.
   * @returns The created user.
   */


  static create(_ref3) {
    let {
      role_name
    } = _ref3;
    return new Promise((resolve, reject) => {
      _database.default.models[this.model].create({
        role_name
      }).then(resolve).catch(reject);
    });
  }

}

exports.role = role;

class event extends shortcutModel {
  static get model() {
    return 'event';
  }
  /**
   * Get the two week interval for the database request.
   */


  static get startInterval() {
    const startDate = (0, _date.resetTime)(new Date());
    const endDate = new Date(new Date().setDate(new Date().getDate() + 14));
    return {
      [_sequelize.Op.between]: [startDate, endDate]
    };
  }
  /**
   * Get all the events which aren't deleted in the two weeks interval.
   * @param {array} includes The models it should include.
   * @returns An array of event objects.
   */


  static findAll() {
    let includes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    const startDate = (0, _date.resetTime)(new Date());
    const endDate = new Date(new Date().setDate(new Date().getDate() + 14));
    return new Promise((resolve, reject) => {
      return this.findAllWithCondition({
        start: {
          [_sequelize.Op.between]: [startDate, endDate]
        },
        deleted_at: null
      }, includes).then(resolve).catch(reject);
    });
  }
  /**
   * Get all the events which aren't deleted in the two weeks interval with the given conditions.
   * @param {object} conditions The required conditions.
   * @param {array} includes The models it should include.
   * @returns An array of event objects.
   */


  static findAllBy(conditions) {
    let includes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    return new Promise((resolve, reject) => {
      this.findAllWithCondition(_objectSpread(_objectSpread({}, conditions), {}, {
        start: this.startInterval,
        deleted_at: null
      }), includes).then(resolve).catch(reject);
    });
  }
  /**
   * Get all the events where the label is in the given array which aren't deleted.
   * @param {array} labelIds The array of labels ids.
   * @param {array} includes The models it should include.
   * @returns An array of event objects.
   */


  static findAllByLabelIds(labelIds) {
    let includes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    return new Promise((resolve, reject) => {
      this.findAllBy({
        labelId: {
          [_sequelize.Op.in]: labelIds
        }
      }, includes).then(resolve).catch(reject);
    });
  }

}

exports.event = event;
//# sourceMappingURL=shortcut.js.map