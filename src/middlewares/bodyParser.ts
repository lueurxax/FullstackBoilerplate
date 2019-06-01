// Parse application/json, application/x-www-form-urlencoded
// NOT form/multipart!
import * as bodyParser from 'koa-bodyparser';

export default bodyParser({ jsonLimit: '56kb' });
