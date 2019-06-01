import { Context } from 'koa';

export const root = (ctx: Context) => {
  ctx.body = {
    messsage: 'Welcome',
  }
};
