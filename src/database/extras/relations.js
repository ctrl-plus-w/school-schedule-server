export default async (sequelize) => {
  const { event, label, role, subject, user, user_labels } = sequelize.models;

  // User / Label relation.
  label.belongsToMany(user, { through: user_labels, foreignKey: 'label_id', otherKey: 'user_id' });
  user.belongsToMany(label, { through: user_labels, foreignKey: 'user_id', otherKey: 'label_id' });

  // User / LabelPermission relation.
  // user.belongsToMany(label, { through: 'LabelPermissions' });
  // label.belongsToMany(user, { through: 'LabelPermissions' });

  // Subject / Label relation.
  subject.hasOne(label);
  label.belongsTo(subject);

  // User / Role relation.
  role.hasOne(user);
  user.belongsTo(role);

  // Event / Owner / Label relation.
  user.hasOne(event);
  event.belongsTo(user);

  label.hasOne(event);
  event.belongsTo(label);
};
