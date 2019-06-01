import * as Koa from 'koa';
const app = new Koa();
import * as config from 'config';

import middleware from './middlewares';
import { sync } from './libs/sequelize';

sync().catch(console.error);

app.use(middleware());

app.listen(config.get('web.port'));
