const debug = require("debug")
const swaggerCombine = require("swagger-combine")
const sway = require("sway")
const { ValidationError } = require("./errors")

module.exports.createExpressMiddleware = async (
  swaggerIndexFile,
  swayOptions = {} // https://github.com/apigee-127/sway/blob/master/docs/API.md#swaycreateoptions--object
) => {
  const combinedContent = await swaggerCombine(swaggerIndexFile)
  const apiSpec = await sway.create({
    definition: combinedContent,
    ...swayOptions
  })
  return async (req, res, next) => {
    const { method, path } = req
    const routeSpec = apiSpec.getOperation(req)
    if (routeSpec === undefined) {
      debug(`No matched spec found for ${method} ${path}`)
      return next()
    }
    wrapResponse(routeSpec, res, next)
    try {
      checkValidationResult(routeSpec.validateRequest(req))
      next()
    } catch (e) {
      next(e)
    }
  }
}

function wrapResponse(routeSpec, res, next) {
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
        routeSpec.validateResponse({
          body: data,
          headers: { ...res.getHeaders() },
          statusCode: res.statusCode,
          encoding: encoding
        })
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
