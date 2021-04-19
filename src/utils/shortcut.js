import database from '../database';

class shortcutModel {
  /**
   * Find a record by its id with the given conditions.
   * @param {string} id The record id.
   * @param {object} conditions The models it should include.
   * @param {array} includes The models it should include.
   * @returns An object.
   */
  static findWithCondition(id, conditions = {}, includes = []) {
    return new Promise((resolve, reject) => {
      database.models[this.model].findByPk(id, { where: conditions, include: includes }).then(resolve).catch(reject);
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
   * @param {object} conditions The conditions to find the record.
   * @param {array} includes The models it should include.
   * @returns An object.
   */
  static findBy(conditions, includes = []) {
    return new Promise((resolve, reject) => {
      database.models[this.model].findOne({ where: conditions, include: includes }).then(resolve).catch(reject);
    });
  }

  /**
   * Find a record by its name.
   * @param {string} name The name of the record. (e.g. label > { label_name : 'name' })
   * @param {array} includesThe models it shoud include.
   * @returns An object.
   */
  static findByName(name, includes = []) {
    return new Promise((resolve, reject) => {
      this.findBy({ [`${this.model}_name`]: name, deleted_at: null }, includes)
        .then(resolve)
        .catch(reject);
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
  static get model() {
    return 'label';
  }
}

export class user extends shortcutModel {
  static get model() {
    return 'user';
  }

  /**
   * Find a user by its id and include its role.
   * @param {string} id The user id.
   * @returns A user object.
   */
  static findWithRole(id) {
    return new Promise((resolve, reject) => {
      this.find(id, database.models.role).then(resolve).catch(reject);
    });
  }

  /**
   * Find a user by its username.
   * @param {string} username The user username.
   * @returns A user object.
   */
  static findByUsername(username) {
    return new Promise((resolve, reject) => {
      this.findBy({ username: username, deleted_at: null }).then(resolve).catch(reject);
    });
  }

  /**
   * Create a user.
   * @param args The arguments provided to create the user. Must contain `username`, `full_name` and `password`.
   * @returns The created user.
   */
  static create({ username, full_name, password }) {
    return new Promise((resolve, reject) => {
      database.models[this.model].create({ username, full_name, password }).then(resolve).catch(reject);
    });
  }
}

export class subject extends shortcutModel {
  static get model() {
    return 'subject';
  }

  /**
   * Create a subject.
   * @param args The arguments provided to create the subject. Must contain `subject_name`.
   * @returns The created user.
   */
  static create({ subject_name }) {
    return new Promise((resolve, reject) => {
      database.models[this.model].create({ subject_name }).then(resolve).catch(reject);
    });
  }
}

export class role extends shortcutModel {
  static get model() {
    return 'role';
  }
}
