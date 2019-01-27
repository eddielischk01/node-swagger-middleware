interface CreateMiddlewareOptions {
  swayOptions?: {
    definition: object | string,
    jsonRefs?: object,
    customFormats?: {
      [key: string]: Function
    },
    customFormatGenerators?: {
      [key: string]: Function
    },
    customValidators?: Array<Function>,
  }, // https://github.com/apigee-127/sway/blob/master/docs/API.md#swaycreateoptions--object
  swayValidateRequestOptions?: {
    strictMode?: boolean | {
      formData?: boolean,
      header?: boolean,
      query?: boolean
    },
    customValidators? : Array<Function> // https://github.com/apigee-127/sway/blob/master/docs/API.md#module_sway.RequestValidationFunction
  }, // https://github.com/apigee-127/sway/blob/master/docs/API.md#swayrequestvalidationoptions--object
  swayValidateResponseOptions?: {
    strictMode?: boolean | {
      header?: boolean
    },
    customValidators? : Array<Function>
  }, // https://github.com/apigee-127/sway/blob/master/docs/API.md#swayresponsevalidationoptions--object
  middlewareOptions?: {
    strictMode: boolean
  }
}

declare namespace SwaggerMiddleware {
  function createExpressMiddleware(swaggerIndexFile: string, options: CreateMiddlewareOptions): Function;
  function createKoaMiddleware(swaggerIndexFile: string, options: CreateMiddlewareOptions): Function;
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