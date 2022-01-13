/* eslint-disable no-unused-vars */
import database from '../database';

import bcrypt from 'bcrypt';

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
  const { role, label, subject, user } = database.models;

  const adminRole = await role.create({ role_name: 'Admin' });
  const professorRole = await role.create({ role_name: 'Enseignant' });
  const studentRole = await role.create({ role_name: 'Élève' });

  console.log('Created the roles ! (Admin, Enseignant, Élève)');

  const term1 = await label.create({ label_name: 'Term1' });
  const term2 = await label.create({ label_name: 'Term2' });

  console.log('Created the labels ! (Term1, Term2)');

  const frenchSubject = await subject.create({ subject_name: 'Français', color: 'red' });
  const historySubject = await subject.create({ subject_name: 'Histoire', color: 'green' });

  console.log('Created the subjects ! (Français[Red], Histoire[Green])');

  const admin = await user.create({
    full_name: 'admin',
    username: 'admin',
    password: bcrypt.hashSync('admin', 12),
  });

  await admin.setRole(adminRole);

  console.log('Created the admin with the admin role.');

  const johndoe = await user.create({
    full_name: 'John Doe',
    username: 'johndoe',
    password: bcrypt.hashSync('johndoe', 12),
  });

  await johndoe.setRole(professorRole);
  await johndoe.addSubject(frenchSubject);

  console.log('Created "johndoe" with the professor role and the french subject.');

  const alexmac = await user.create({
    full_name: 'Alex Mac',
    username: 'alexmac',
    password: bcrypt.hashSync('alexmac', 12),
  });

  await alexmac.setRole(professorRole);
  await alexmac.addSubject(historySubject);

  console.log('Created "alexmac" with the professor role and the history subject.');

  const lukas = await user.create({
    full_name: 'Lukas Laudrain',
    username: 'lukaslaudrain',
    password: bcrypt.hashSync('lukaslaudrain', 12),
  });

  await lukas.setRole(studentRole);
  await lukas.addLabel(term1);

  console.log('Created "lukaslaudrain" with the student role and with the Term1 label.');

  const robinson = await user.create({
    full_name: 'Robinson Rambeau',
    username: 'robinsonrambeau',
    password: bcrypt.hashSync('robinsonrambeau', 12),
  });

  await robinson.setRole(studentRole);
  await robinson.addLabel(term2);

  console.log('Created "robinsonrambeau" with the student role and with the Term2 label.');

  const rose = await user.create({
    full_name: 'Rose Yazid',
    username: 'roseyazid',
    password: bcrypt.hashSync('roseyazid', 12),
  });

  await rose.setRole(studentRole);

  console.log('Created "roseyazid" with the student role and without labels.');

  console.log('\nFinished to seed the database !');
})();
