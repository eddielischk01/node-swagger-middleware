import * as sway from "sway"
import * as ajv from "ajv"

interface CreateMiddlewareOptions {
  swayOptions?: sway.CreateOptions,
  swayValidateRequestOptions?: sway.RequestValidationOptions,
  swayValidateResponseOptions?: sway.ResponseValidationOptions,
  ajvOptions?: ajv.Options,
  middlewareOptions?: {
    strictMode: boolean
  }
}

declare namespace SwaggerMiddleware {
  function createExpressMiddleware(swaggerIndexFile: string, options: CreateMiddlewareOptions): Function;
  class ValidationError extends Error{
    errors: Array<sway.ValidationEntry>
  }
  class AJVValidationError extends Error{
    errors: Array<ajv.ErrorObject>
  }
  class SpecNotFoundError extends Error {}

}

declare module "node-swagger-middleware" {
  export = SwaggerMiddleware;
}