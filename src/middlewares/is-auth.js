import jwt from 'jsonwebtoken';

import config from '../config';

export default async ({ req }) => {
  const authHeader = await req.get('Authorization');
  if (!authHeader) return { auth: false };

  const token = await authHeader.split(' ')[1];
  if (!token || token === '') return { auth: false };

  try {
    const decodedToken = jwt.verify(token, config.JWT_KEY);
    if (!decodedToken) return { auth: false };

    console.log(decodedToken);

    return {
      auth: true,
      id: decodedToken.id,
      username: decodedToken.username,
      role: decodedToken.role,
    };
  } catch (err) {
    return { auth: false };
  }
};
