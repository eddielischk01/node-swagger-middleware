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
  return (req, res, next) => {
    const { method, path } = req
    const routeSpec = apiSpec.getOperation(req)
    if (routeSpec === undefined) {
      debug(`No matched spec found for ${method} ${path}`)
      return next()
    }
    checkValidationResult(routeSpec.validateRequest(req))
    getResponseContent(res)
      .then(responseBody => {
        checkValidationResult(
          routeSpec.validateResponse({
            body: responseBody,
            headers: { ...res.getHeaders() },
            statusCode: res.statusCode
          })
        )
      })
      .catch(e => {
        debug(`What happened? ${e}`)
      })
    next()
  }
}

function getResponseContent(res) {
  return new Promise((resolve, reject) => {
    const { write: oldWrite, end: oldEnd } = res

    const chunks = []

    res.write = function(chunk) {
      chunks.push(chunk)
      oldWrite.apply(res, arguments)
    }

    res.end = function(chunk) {
      if (chunk) chunks.push(chunk)
      oldEnd.apply(res, arguments)
      try {
        resolve(Buffer.concat(chunks))
      } catch (e) {
        reject(e)
      }
    }
  })
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
