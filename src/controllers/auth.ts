import {
  controller,
  description,
  ENUM_PARAM_IN,
  parameter,
  post,
  response,
  summary,
  tag
} from "koa-joi-swagger-ts";
import { Context } from 'koa';
import { authentication } from '../libs/auth/login';
import { LoginResponseSchema } from './schemas/auth.response';
import { BaseAPIResponseSchema } from './schemas/baseAPI.response';
import { LoginRequestSchema } from './schemas/auth.request';

@controller("/v1")
export abstract class AuthController {
  @post("/login")
  @parameter("body", { $ref: LoginRequestSchema }, ENUM_PARAM_IN.body)
  @response(200, { $ref: LoginResponseSchema })
  @response(400, { $ref: BaseAPIResponseSchema })
  @response(401, { $ref: BaseAPIResponseSchema })
  @response(500, { $ref: BaseAPIResponseSchema })
  @tag("Auth")
  @description("Authenticate user with oauth2")
  @summary("login user")
  public async login(ctx: Context): Promise<void> {
    const { email, password } = ctx.request.body;
    try {
      const token = await authentication(email, password);
      const tomorrow = new Date();
      // TODO need compare with config.get('expiresIn')
      tomorrow.setDate(tomorrow.getDate() + 1);
      ctx.body = {
        token,
        expiredAt: tomorrow,
      }
    } catch (err) {
      console.log(Object.keys(err));
      ctx.throw(err.code, err.message);
    }
  };
}
