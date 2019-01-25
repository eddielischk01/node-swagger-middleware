const Koa = require("koa")
const Router = require("koa-router")
const { createKoaMiddleware } = require("../src")
const { ValidationError, SpecNotFoundError } = require("../src/errors")

module.exports.createKoaApp = async middlewareOptions => {
  const app = new Koa()
  const router = new Router()
  router.get("/v1/whoami", ctx => {
    const { name } = ctx.request.query
    ctx.body = {
      name: "Unit Testing",
      purpose: "Middleware for integrate express and OpenAPI",
      whoareyou: name
    }
  })
  router.get("/v1/response-schema-mismatch", ctx => {
    const { name } = ctx.request.query
    ctx.body = {
      name: "Unit Testing",
      purpose: "Middleware for integrate express and OpenAPI",
      whoareyou: name
    }
  })
  router.get("/echo", ctx => {
    ctx.body = {}
  })
  app.use(async (ctx, next) => {
    try {
      await next()
    } catch (e) {
      if (e instanceof ValidationError) {
        ctx.status = 400
        ctx.body = { message: e.message }
      } else if (e instanceof SpecNotFoundError) {
        ctx.status = 404
      } else {
        throw e
      }
    }
  })
  app.use(
    await createKoaMiddleware(
      `${__dirname}/fixtures/index.yml`,
      middlewareOptions
    )
  )
  app.use(router.routes())
  app.use(router.allowedMethods())
  return app
}
