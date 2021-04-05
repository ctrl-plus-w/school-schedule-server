import database from '../database';

import EventModel from './EventModel';
import LabelModel from './LabelModel';
import LabelPermissionModel from './LabelPermissionModel';
import RoleModel from './RoleModel';
import SubjectModel from './SubjectModel';
import UserModel from './UserModel';
import UserLabelModel from './UserLabelModel';

export const Event = database.define('Event', EventModel);

export const Label = database.define('Label', LabelModel);
export const LabelPermission = database.define('LabelPermission', LabelPermissionModel);

export const Role = database.define('Role', RoleModel);

export const Subject = database.define('Subject', SubjectModel);

export const User = database.define('User', UserModel);
export const UserLabel = database.define('UserLabel', UserLabelModel);
