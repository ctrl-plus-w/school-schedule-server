/* eslint-disable no-unused-vars */
import database from '../database';

const subjects = [
  // Sciences
  'Maths',
  'Sciences',

  // Littérature
  'Français',

  'Histoire Géo',
  'EMC',

  // Langues
  'Anglais',
  'Espagnol',
  'Allemand',

  // Autres
  'EPS',
  'Orientation',
  'AP',
  'Vie de classe',

  // Spés
  'SpéNSI',
  'SpéMaths',
  'SpéAnglais',
  'SpéNSI',
  'SpéPhysique',
  'SpéSVT',
];

const labels = [
  // Classes
  '1ère1',
  '1ère2',
  '1ère3',
  '1ère4',
  '1ère5',
  '1ère6',

  '2nd1',
  '2nd2',
  '2nd3',
  '2nd4',
  '2nd5',
  '2nd6',

  'Term1',
  'Term2',
  'Term3',
  'Term4',
  'Term5',
  'Term6',
];

(async () => {
  // await database.models.subject.bulkCreate(subjects.map((subject) => ({ subject_name: subject })));
  // await database.models.label.bulkCreate(labels.map((label) => ({ label_name: label })));

  const adminRole = await database.models.role.findOne({ where: { role_name: 'Admin' } });
  if (adminRole) return;

  await database.models.role.create({ role_name: 'Admin' });

  const admin = await database.models.user.create({
    full_name: 'admin',
    username: 'admin',
    password: '$2y$12$Gjah1.kWTAwcg1nPiEcIPeH83Q9BESJq21nWTDdZ7Duwu0qC8BdqG',
  });

  await admin.setRole(adminRole);
})();
