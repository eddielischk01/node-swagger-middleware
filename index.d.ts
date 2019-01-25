
interface MiddlewareOptions {
  strictMode: boolean
}

declare namespace SwaggerMiddleware {
  function createExpressMiddleware(swaggerIndexFile: string, options: {
    swayOptions: Object, // https://github.com/apigee-127/sway/blob/master/docs/API.md#swaycreateoptions--object
    middlewareOptions: MiddlewareOptions
  }): Function;
  function createKoaMiddleware(swaggerIndexFile: string, options: {
    swayOptions: Object, // https://github.com/apigee-127/sway/blob/master/docs/API.md#swaycreateoptions--object
    middlewareOptions: MiddlewareOptions
  }): Function;
  interface ValidationError extends Error{
    errors: Array<{
      code: string,
      errors: Array<{
        code: string,
        message: string,
        path: string
      }>,
      in: string,
      message: string,
      name: string,
      path: string
    }>
  }
  interface SpecNotFoundError extends Error {}
}

declare module "node-swagger-middleware" {
  export = SwaggerMiddleware;
}