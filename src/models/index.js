import database from '../database';

import EventModel from './EventModel';
import EventOptions from './EventOptions';

import LabelModel from './LabelModel';
import LabelOptions from './LabelOptions';

import RoleModel from './RoleModel';
import RoleOptions from './RoleOptions';

import SubjectModel from './SubjectModel';
import SubjectOptions from './SubjectOptions';

import UserModel from './UserModel';
import UserOptions from './UserOptions';

export const Event = database.define('Event', EventModel, EventOptions);

export const Label = database.define('Label', LabelModel, LabelOptions);

export const Role = database.define('Role', RoleModel, RoleOptions);

export const Subject = database.define('Subject', SubjectModel, SubjectOptions);

export const User = database.define('User', UserModel, UserOptions);
