import { Context } from 'koa';
import { authentication } from '../libs/auth/login';

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
    ctx.body = {
      token,
      expiredAt: new Date(),
    }
  } catch (err) {
    console.log(Object.keys(err));
    ctx.throw(err.code, err.message);
  }
};

type KoaFuncRequest = (ctx: Context, next: () => Promise<any>) => void

export const requireAuth = (func: KoaFuncRequest): KoaFuncRequest => {
  // TODO check JWT token
  return func
};
