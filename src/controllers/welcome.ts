import { controller, description, get, response, summary, tag } from 'koa-joi-swagger-ts';
import { BaseContext } from 'koa';
import { WelcomeResponseSchema } from './schemas/welcomeResponse';

@controller("/v1")
export abstract class WelcomeController {
  @get("/welcome")
  @response(200, { $ref: WelcomeResponseSchema })
  @tag("GET")
  @description("Returns welcome message")
  @summary("Show API index page")
  public async welcome(ctx: BaseContext): Promise<void> {
    ctx.status = 200;
    ctx.body = {
      message: 'Welcome',
    }
  };
}
