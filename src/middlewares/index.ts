import * as cors from 'kcors';
import * as compose from 'koa-compose';
import * as favicon from 'koa-favicon';
// import * as serve from 'koa-static';
import errors from './errors';
import bodyParser from './bodyParser';
import logger from './logger';
import tracer from './tracer';
import router from './router';

export default () => {
  return compose([
    favicon(),
    // serve('media'),
    logger,
    errors(),
    cors(),
    bodyParser,
    tracer(),
    router.routes(),
    router.allowedMethods(),
  ]);
};
