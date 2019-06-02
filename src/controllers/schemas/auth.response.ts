import * as Joi from "joi";
import { definition } from "koa-joi-swagger-ts";

@definition("ApiInfo", "Information data about current application and API version")
export class LoginResponseSchema {
  public token = Joi.string()
      .description("Bearer token")
      .required();
  public expiredAt = Joi.date().description("datetime when token is expired").required();
}
