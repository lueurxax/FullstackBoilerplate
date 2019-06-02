// Parse application/json, application/x-www-form-urlencoded
// NOT form/multipart!
import bodyParser from 'koa-bodyparser';

export default bodyParser({ jsonLimit: '56kb' });
