import database from '../database';

class shortcutModel {
  /**
   * @param {string} model The name of the database model.
   */
  constructor(model) {
    this.model = model;
  }

  /**
   * Find a record by its id with the given conditions.
   * @param {string} id The record id.
   * @returns An object.
   */
  static findWithCondition(id, condition, includes = []) {
    return new Promise((resolve, reject) => {
      database.models[this.model].findByPk(id, { where: condition, include: includes }).then(resolve).catch(reject);
    });
  }

  /**
   * Find a record by its id.
   * @param {string} id The record id.
   * @param {array} includes The models it should include.
   * @returns An object.
   */
  static find(id, includes = []) {
    return new Promise((resolve, reject) => {
      this.findWithCondition(id, { deleted_at: null }, includes).then(resolve).catch(reject);
    });
  }

  /**
   * Find a record by the given condition.
   * @param {object} condition The condition to find the record.
   * @param {array} includes The models it should include.
   * @returns An object.
   */
  static findBy(condition, includes = []) {
    return new Promise((resolve, reject) => {
      database.models[this.model].findOne({ where: condition, include: includes }).then(resolve).catch(reject);
    });
  }

  /**
   * Get all records with the given conditions.
   * @param {object} condition The condition to find the record.
   * @param {array} includes The models it should include.
   * @returns An array of objects.
   */
  static findAllWithCondition(condition, includes = []) {
    return new Promise((resolve, reject) => {
      database.models[this.model].findAll({ where: condition, include: includes }).then(resolve).catch(reject);
    });
  }

  /**
   * Get all the records which aren't deleted.
   * @param {array} includes The models it should include.
   * @returns An array of objects.
   */
  static findAll(includes = []) {
    return new Promise((resolve, reject) => {
      this.findAllWithCondition({ deleted_at: null }, includes).then(resolve).catch(reject);
    });
  }

  /**
   * Get all the records whether they are deleted or not.
   * @param {array} includes The models it should include.
   * @returns An array of objects.
   */
  static findAllDeleted(includes = []) {
    return new Promise((resolve, reject) => {
      database.models[this.model].findAll({ include: includes }).then(resolve).catch(reject);
    });
  }
}

export class label extends shortcutModel {
  constructor() {
    super('label');
  }
}

export class user extends shortcutModel {
  constructor() {
    super('user');
  }

  /**
   * Find a record by its id and include its role.
   * @param {string} id The record id.
   * @returns An object.
   */
  static findWithRole(id) {
    return new Promise((resolve, reject) => {
      this.find(id, database.models.role).then(resolve).catch(reject);
    });
  }

  static create({ username, full_name, password }) {
    return new Promise((resolve, reject) => {
      database.models[this.model].create({ username, full_name, password }).then(resolve).catch(reject);
    });
  }
}

export class subject extends shortcutModel {
  constructor() {
    super('subject');
  }
}

export class role extends shortcutModel {
  constructor() {
    super('role');
  }
}
