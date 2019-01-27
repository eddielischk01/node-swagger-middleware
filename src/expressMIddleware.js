const debug = require("debug")
const swaggerCombine = require("swagger-combine")
const sway = require("sway")
const { ValidationError, SpecNotFoundError } = require("./errors")

module.exports.createExpressMiddleware = async (
  swaggerIndexFile,
  options = {
    swayOptions: {}, // https://github.com/apigee-127/sway/blob/master/docs/API.md#swaycreateoptions--object
    swayValidateRequestOptions: {
      strictMode: true
    },
    swayValidateResponseOptions: {
      strictMode: false
    },
    middlewareOptions: {
      strictMode: false
    }
  }
) => {
  const {
    swayOptions,
    middlewareOptions,
    swayValidateRequestOptions,
    swayValidateResponseOptions
  } = options
  const { strictMode } = middlewareOptions
  const combinedContent = await swaggerCombine(swaggerIndexFile)
  const apiSpec = await sway.create({
    definition: combinedContent,
    ...swayOptions
  })
  return async (req, res, next) => {
    const { method, path } = req
    const routeSpec = apiSpec.getOperation(req)
    if (!routeSpec) {
      if (strictMode) {
        next(new SpecNotFoundError(method, path))
      } else {
        debug(`No matched spec found for ${method} ${path}`)
        return next()
      }
    }
    wrapResponse(
      {
        spec: routeSpec,
        responseValidateOptions: swayValidateResponseOptions
      },
      res,
      next
    )
    try {
      checkValidationResult(
        routeSpec.validateRequest(req, swayValidateRequestOptions)
      )
      next()
    } catch (e) {
      next(e)
    }
  }
}

function wrapResponse(routeSpec, res, next) {
  const { spec, responseValidateOptions } = routeSpec
  const { write: oldWrite, end: oldEnd } = res

  const chunks = []

  res.write = function(chunk) {
    chunks.push(chunk)
  }

  res.end = function(chunk, encoding) {
    if (chunk) chunks.push(chunk)
    res.write = oldWrite
    res.end = oldEnd
    let data
    try {
      data = Buffer.concat(chunks)
    } catch (e) {
      data = chunk
    }
    try {
      checkValidationResult(
        spec.validateResponse(
          {
            body: data,
            headers: { ...res.getHeaders() },
            statusCode: res.statusCode,
            encoding: encoding
          },
          responseValidateOptions
        )
      )
      res.end(data, encoding)
    } catch (e) {
      next(e)
    }
  }
}

function checkValidationResult(validationResult) {
  if (validationResult.errors.length > 0) {
    debug("SwaggerValidationError:", validationResult)
    throw new ValidationError(validationResult)
  }

  if (validationResult.warnings.length > 0) {
    debug(`Swagger validation warning: ${validationResult.warnings}`)
  }
}
