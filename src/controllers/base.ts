import { BaseContext } from "koa";
import { controller, description, get, response, summary, tag } from "koa-joi-swagger-ts";
import { ApiInfoResponseSchema } from './schemas/apiInfo.response';

@controller("/v1")
export abstract class BaseController {
  @get("/")
  @response(200, { $ref: ApiInfoResponseSchema })
  @tag("GET")
  @description("Returns text info about version of API")
  @summary("Show API index page")
  public async index(ctx: BaseContext): Promise<void> {
    ctx.status = 200;
    ctx.body = {
      code: 200,
      data: {
        appVersion: "1.0.0",
        build: "1001",
        apiVersion: 1,
        reqHeaders: ctx.request.headers,
        apiDoc: "/v1/swagger.json"
      }
    }
  };
}
