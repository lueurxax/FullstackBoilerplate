import Koa from 'koa';
import config from 'config';

import middleware from './middlewares';
import { sync } from './libs/sequelize';

const app = new Koa();

sync().catch(console.error);

app.use(middleware());

app.listen(config.get('web.port'));
