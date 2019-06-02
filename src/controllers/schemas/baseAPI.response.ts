import * as Joi from "joi";
import { definition } from "koa-joi-swagger-ts";

@definition("BaseAPIResponse", "Base response entity with base fields")
export class BaseAPIResponseSchema {
  public code = Joi.number()
    .required()
    .strict()
    .only(200, 400, 401, 500)
    .example(400)
    .description("Code of operation result");
  public message = Joi.string().description("message will be filled in some causes");
}
