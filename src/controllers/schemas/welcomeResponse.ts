import { definition } from 'koa-joi-swagger-ts';
import * as Joi from 'joi';

@definition("Welcome", "welcome message")
export class WelcomeResponseSchema{
  public message = Joi.string().required()
}
