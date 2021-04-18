import database from '../database';

export class label {
  /**
   * Find a label by its id.
   * @param {string} id The id of the label to find.
   * @returns A label object.
   */
  static find(id) {
    return new Promise((resolve, reject) => {
      database.models.label
        .findByPK(id, { where: { deleted_at: null } })
        .then(resolve)
        .catch(reject);
    });
  }

  /**
   * Find all labels by names.
   * @param {array} names The array of names to find the labels.
   * @returns An array of labels.
   */
  static findAllByName(name) {
    return new Promise((resolve, reject) => {
      database.models.label
        .findAll({ where: { deleted_at: null, label_name: name } })
        .then(resolve)
        .catch(reject);
    });
  }
}

export class subject {
  /**
   * Find all subjects by names.
   * @param {array} names The array of names to find the subjects.
   * @returns An array of subjects.
   */
  static findAllByName(names) {
    return new Promise((resolve, reject) => {
      database.models.subject
        .findAll({ where: { deleted_at: null, subject_name: names } })
        .then(resolve)
        .catch(reject);
    });
  }
}

export class role {
  /**
   * Find a role by its name.
   * @param {string} name The name of the role to find.
   * @returns A role object.
   */
  static findByName(name) {
    return new Promise((resolve, reject) => {
      database.models.role
        .findOne({ where: { deleted_at: null, role_name: name } })
        .then(resolve)
        .catch(reject);
    });
  }
}

export class user {
  /**
   * Find a user by its id.
   * @param {string} id The id of the user to find.
   * @returns A user object.
   */
  static find(id) {
    return new Promise((resolve, reject) => {
      database.models.user
        .findByPK(id, { where: { deleted_at: null } })
        .then(resolve)
        .catch(reject);
    });
  }

  /**
   * Find a user by its id whether he is deleted or not.
   * @param {string} id The id of the user to find.
   * @returns A user object.
   */
  static findDeleted(id) {
    return new Promise((resolve, reject) => {
      database.models.user.findByPK(id).then(resolve).catch(reject);
    });
  }

  /**
   * Find a user with its role by its id.
   * @param {string} id The id of the user to find.
   * @returns A user object including its role object.
   */
  static findWithRole(id) {
    return new Promise((resolve, reject) => {
      database.models.user
        .findByPK(id, { where: { deleted_at: null }, include: database.models.role })
        .then(resolve)
        .catch(reject);
    });
  }
}
