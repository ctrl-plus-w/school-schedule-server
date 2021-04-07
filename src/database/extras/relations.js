export default async (sequelize) => {
  const { event, label, role, subject, user, user_labels, user_subjects, user_subjects_owners  } = sequelize.models;

  // User / Label relation.
  label.belongsToMany(user, { through: user_labels, foreignKey: 'label_id', otherKey: 'user_id' });
  user.belongsToMany(label, { through: user_labels, foreignKey: 'user_id', otherKey: 'label_id' });

  // Subject / User (owning) relation.
  subject.belongsToMany(user, { through: user_subjects, foreignKey: 'subject_id', other_key: 'user_id' });
  user.belongsToMany(subject, { through: user_subjects, foreignKey: 'user_id', other_key: 'subject_id' });

  // Subject / Event relation.
  subject.hasOne(event);
  event.belongsTo(subject);

  // Label / Event relation.
  label.hasMany(event);
  event.belongsTo(label);

  // Subject / Owner relation.
  user.hasOne(event, { foreignKey: 'owner_id' });
  event.belongsTo(user, { foreignKey: 'owner_id' });

  // User / Role relation.
  role.hasMany(user);
  user.belongsTo(role);
};
