import * as Joi from "joi";
import { definition } from "koa-joi-swagger-ts";

@definition("AuthRequest", "User data")
export class LoginRequestSchema {
  public email = Joi.string()
    .email()
    .description("User email")
    .example("user5@mail.com")
    .required();
  public password = Joi.string()
    .description("User password")
    .example("strongPassword")
    .required();
}
