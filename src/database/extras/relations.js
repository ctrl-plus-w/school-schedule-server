export default async (sequelize) => {
  const { event, label, role, subject, user } = sequelize.models;

  // User / Label relation.
  user.belongsToMany(label, { through: 'UserLabels' });
  label.belongsToMany(user, { through: 'UserLabels' });

  // User / LabelPermission relation.
  user.belongsToMany(label, { through: 'LabelPermissions' });
  label.belongsToMany(user, { through: 'LabelPermissions' });

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
