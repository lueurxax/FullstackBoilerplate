import config from 'config';
import { KJSRouter } from 'koa-joi-swagger-ts';
import { ApiInfoResponseSchema } from '../controllers/schemas/apiInfo.response';
import { BaseAPIResponseSchema } from '../controllers/schemas/baseAPI.response';
import { BaseController } from '../controllers/base';
import { LoginResponseSchema } from '../controllers/schemas/auth.response';
import { AuthController } from '../controllers/auth';
import { LoginRequestSchema } from '../controllers/schemas/auth.request';
import { verify } from '../libs/auth/login';
import logger from '../libs/logger';
import { WelcomeController } from '../controllers/welcome';
import { WelcomeResponseSchema } from '../controllers/schemas/welcomeResponse';

const requireAuth = async (controller, ctx): Promise<void> => {
  try {
    ctx.request.body.user = verify(ctx.request.header.authorization);
    console.log(ctx.request.body.user);
    await controller(ctx);
  } catch (err) {
    logger.error(err);
    ctx.throw(err.code, err.message)
  }
};

export const loadRoutes = () => {
  const router = new KJSRouter({
    swagger: "2.0",
    info: {
      version: "1.0.0",
      title: "fullstack-boilerplate"
    },
    host: `localhost:${config.get('web.port')}`,
    basePath: "/v1",
    schemes: ["http"],
    paths: {
      '/welcome':{
        'get':{
          'security': {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
          }
        }
      },
    },
    definitions: {}
  });

  router.loadDefinition(ApiInfoResponseSchema);
  router.loadDefinition(BaseAPIResponseSchema);
  router.loadDefinition(LoginResponseSchema);
  router.loadDefinition(LoginRequestSchema);
  router.loadDefinition(WelcomeResponseSchema);

  router.loadController(BaseController);
  router.loadController(AuthController);
  router.loadController(WelcomeController, requireAuth);

  router.setSwaggerFile("swagger.json");
  router.loadSwaggerUI("/docs");

  return router.getRouter();
};
