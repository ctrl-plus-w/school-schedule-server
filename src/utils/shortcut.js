import { Op } from 'sequelize';

import { resetTime } from '../utils/date';

import database from '../database';

class shortcutModel {
  /**
   * Find a record by its id with the given conditions.
   * @param {string} id The record id.
   * @param {object} conditions The required conditions.
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
   * Find a record by its id whether he is deleted or not.
   * @param {string} id The record id.
   * @param {array} includes The models it should include.
   * @returns An object.
   */
  static findDeleted(id, includes = []) {
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
  static findBy(conditions, includes = []) {
    return new Promise((resolve, reject) => {
      database.models[this.model].findOne({ where: conditions, include: includes }).then(resolve).catch(reject);
    });
  }

  /**
   * Find a record by its name.
   * @param {string} name The name of the record. (e.g. label > { label_name : 'name' })
   * @param {array} includes The models it shoud include.
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
   * @param {object} conditions The required conditions.
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
   * @param {array} includes The models it should include.
   * @returns A user object.
   */
  static findWithRole(id, includes = []) {
    return new Promise((resolve, reject) => {
      this.find(id, [database.models.role, ...includes])
        .then(resolve)
        .catch(reject);
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
      this.findBy({ username: username, deleted_at: null }, includes).then(resolve).catch(reject);
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
   * @param args The arguments provided to create the subject. Must contain `subject_name` and `color`.
   * @returns The created user.
   */
  static create({ subject_name, color }) {
    return new Promise((resolve, reject) => {
      database.models[this.model].create({ subject_name, color }).then(resolve).catch(reject);
    });
  }
}

export class role extends shortcutModel {
  static get model() {
    return 'role';
  }

  /**
   * Create a role.
   * @param args The arguments provided to create the role. Must contain `role_name`.
   * @returns The created user.
   */
  static create({ role_name }) {
    return new Promise((resolve, reject) => {
      database.models[this.model].create({ role_name }).then(resolve).catch(reject);
    });
  }
}

export class event extends shortcutModel {
  static get model() {
    return 'event';
  }

  /**
   * Get the two week interval for the database request.
   */
  static get startInterval() {
    const startDate = resetTime(new Date());
    const endDate = new Date(new Date().setDate(new Date().getDate() + 14));

    return { [Op.between]: [startDate, endDate] };
  }

  /**
   * Get all the events which aren't deleted in the two weeks interval.
   * @param {array} includes The models it should include.
   * @returns An array of event objects.
   */
  static findAll(includes = []) {
    const startDate = resetTime(new Date());
    const endDate = new Date(new Date().setDate(new Date().getDate() + 14));

    return new Promise((resolve, reject) => {
      return this.findAllWithCondition({ start: { [Op.between]: [startDate, endDate] }, deleted_at: null }, includes)
        .then(resolve)
        .catch(reject);
    });
  }

  /**
   * Get all the events which aren't deleted in the two weeks interval with the given conditions.
   * @param {object} conditions The required conditions.
   * @param {array} includes The models it should include.
   * @returns An array of event objects.
   */
  static findAllBy(conditions, includes = []) {
    return new Promise((resolve, reject) => {
      this.findAllWithCondition({ ...conditions, start: this.startInterval, deleted_at: null }, includes)
        .then(resolve)
        .catch(reject);
    });
  }

  /**
   * Get all the events where the label is in the given array which aren't deleted.
   * @param {array} labelIds The array of labels ids.
   * @param {array} includes The models it should include.
   * @returns An array of event objects.
   */
  static findAllByLabelIds(labelIds, includes = []) {
    return new Promise((resolve, reject) => {
      this.findAllBy({ labelId: { [Op.in]: labelIds } }, includes)
        .then(resolve)
        .catch(reject);
    });
  }
}
