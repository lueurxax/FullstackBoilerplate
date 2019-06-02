import * as config from 'config';
import logger from '../logger';
import { User } from '../../models/user';
import * as crypto from "crypto";
import * as jwt from 'jsonwebtoken';
import Error from '../error';

interface TokenPayload {
  id: string;
  email: string;
}

export const authentication = async (email: string, password: string): Promise<string> => {
  let user: User = null;
  try {
    user = await findUser(email, password);
  } catch (err) {
    throw err;
  }
  const payload: TokenPayload = {
    id: user.id,
    email: user.email,
  };
  try {
    return await generateToken(payload);
  } catch (err) {
    logger.error(err);
    throw new Error({ message: 'access denied', code: 401 });
  }
};

export const generateToken = (payload: TokenPayload): Promise<string> => {
  return new Promise((resolve, reject) => {
    const token = jwt.sign(payload, config.get('secret'), { expiresIn: config.get('expiresIn') });
    if (token) resolve(token);
    else reject('can\'t generate token');
  });
};

export const findUser = async (email: string, password: string): Promise<User> => {
  email = email.toLowerCase();
  let user: User = null;
  try {
    user = await User.findOne({ where: { email } });
  } catch (err) {
    logger.error(err);
    err.code = 500;
    throw err;
  }
  if (!user) {
    logger.warn('Попытка входа с несуществующими учетными данными');
    throw new Error({ message: 'Нет такого пользователя', code: 400 });
  }
  let valid = false;
  try {
    valid = await checkPassword(password, user.salt, user.passwordHash);
  } catch (err) {
    logger.error(err);
    err.code = 500;
    throw err;
  }
  if (!valid) {
    logger.warn('Попытка входа с неверным паролем');
    throw new Error({ message: 'Пароль неверен.', code: 400 });
  }
  logger.info(`Пользователь с id ${user.id} успешно авторизован`);
  return user;
};

export const checkPassword = (password: string, salt: string, passwordHash: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    if (!password) reject(false);
    if (!passwordHash) reject(false);
    resolve(
      crypto.pbkdf2Sync(
        password,
        salt,
        config.get('crypto.hash.iterations'),
        config.get('crypto.hash.length'), 'sha512',
      )
        .toString('base64') === passwordHash);
  });
};

export const verify = (bearerToken: string): User => {
  if (!bearerToken) return null;
  const token = bearerToken.replace('Bearer ', '');
  return jwt.verify(token, config.get('secret'));
};
