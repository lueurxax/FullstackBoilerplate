import * as Router from 'koa-router';
import { login, requireAuth } from '../routes/auth';
import { root } from '../routes/welcome';

var router = new Router();

router.get('/', requireAuth(root));

router.post('/login', login);

export default router;
