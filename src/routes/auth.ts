import { Context } from 'koa';
import { authentication, verify } from '../libs/auth/login';
import logger from '../libs/logger';

export const login = async (ctx: Context): Promise<void> => {
  const { email, password } = ctx.request.body;
  if (!email) {
    ctx.throw(400, 'email is required');
  }
  if (!password) {
    ctx.throw(400, 'password is required');
  }

  try {
    const token = await authentication(email, password);
    const tomorrow = new Date();
    // TODO need compare with config.get('expiresIn')
    tomorrow.setDate(tomorrow.getDate() + 1);
    ctx.body = {
      token,
      expiredAt: tomorrow,
    }
  } catch (err) {
    console.log(Object.keys(err));
    ctx.throw(err.code, err.message);
  }
};

type KoaFuncRequest = (ctx: Context, next: () => Promise<any>) => void

export const requireAuth = (func: KoaFuncRequest): KoaFuncRequest => {
  // check JWT token
  return async (ctx: Context, next: () => Promise<any>) => {
    try {
      ctx.body.user = verify(ctx.request.header.authorization);
    } catch (err) {
      logger.error(err);
      ctx.throw(401, 'Need authorize')
    }
    await func;
  };
};
