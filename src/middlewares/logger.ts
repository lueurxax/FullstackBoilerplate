import logger from '../libs/logger';

import * as koaLogger from 'koa-logger';

export default koaLogger((args) => {
  logger.info(args)
})
