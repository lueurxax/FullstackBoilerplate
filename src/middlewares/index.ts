import cors from 'kcors';
import compose from 'koa-compose';
import favicon from 'koa-favicon';
import serve from 'koa-static';
import errors from './errors';
import bodyParser from './bodyParser';
import logger from './logger';
import tracer from './tracer';
import { loadRoutes } from './router';

export default () => {
  const router = loadRoutes();
  return compose([
    favicon(),
    serve('swagger'),
    logger,
    errors(),
    cors(),
    bodyParser,
    tracer(),
    router.routes(),
    router.allowedMethods(),
  ]);
};
