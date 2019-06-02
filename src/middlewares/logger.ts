import logger from '../libs/logger';

import koaLogger from 'koa-logger';

export default koaLogger((args) => {
  logger.info(args)
})
