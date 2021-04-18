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
  static findWithCondition(id, condition) {
    return new Promise((resolve, reject) => {
      database.models[this.model].findByPk(id, { where: condition }).then(resolve).catch(reject);
    });
  }

  /**
   * Get all records with the given conditions.
   * @param {object} condition The condition to find the record.
   * @returns An array of objects.
   */
  static findAllWithCondition(condition) {
    return new Promise((resolve, reject) => {
      database.models[this.model].findAll({ where: condition }).then(resolve).catch(reject);
    });
  }

  /**
   * Find a record by its id.
   * @param {string} id The record id.
   * @returns An object.
   */
  static find(id) {
    return new Promise((resolve, reject) => {
      this.findWithCondition(id, { deleted_at: null }).then(resolve).catch(reject);
    });
  }

  /**
   * Get all the records which aren't deleted.
   * @returns An array of objects.
   */
  static findAll() {
    return new Promise((resolve, reject) => {
      this.findAllWithCondition({ deleted_at: null }).then(resolve).catch(reject);
    });
  }

  /**
   * Get all the records whether they are deleted or not.
   * @returns An array of objects.
   */
  static findAllDeleted() {
    return new Promise((resolve, reject) => {
      database.models[this.model].findAll().then(resolve).catch(reject);
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
