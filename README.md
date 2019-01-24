# node-swagger-middleware

[![codecov](https://codecov.io/gh/davidNHK/node-swagger-middleware/branch/development/graph/badge.svg)](https://codecov.io/gh/davidNHK/node-swagger-middleware)
[![Build Status](https://travis-ci.org/davidNHK/node-swagger-middleware.svg?branch=development)](https://travis-ci.org/davidNHK/node-swagger-middleware)

Project on top of [sway](https://github.com/apigee-127/sway) and [swagger-combine](https://github.com/maxdome/swagger-combine)
to provide middleware for express / koa request/response validate 

# Example Usage
Express [Example App](./__tests__/expressApp.js)
```js
const express = require("express")
const { createExpressMiddleware, ValidationError } = require("node-swagger-middleware")
createExpressApp = async () => {
  const app = express()
  const swaggerIndexFile = `${__dirname}/fixtures/index.yml`
  app.use(express.json())
  app.use(await createExpressMiddleware(swaggerIndexFile))
  app.use((err, req, res, next) => {
    if (err instanceof ValidationError) {
      res.status(400)
    } else {
      res.status(500)
    }
    res.send({
      err
    })
  })
  return app
}
```

Koa [Example App](./__tests__/koaApp.js)
```js
const { createExpressMiddleware, ValidationError } = require("node-swagger-middleware")
const Koa = require("koa")
createKoaApp = async function() {
  const app = new Koa()
  const swaggerIndexFile = `${__dirname}/fixtures/index.yml`
  app.use(async (ctx, next) => {
    try {
      await next()
    } catch (e) {
      if (e instanceof ValidationError) {
        ctx.status = 400
        ctx.body = { message: e.message }
      } else {
        throw e
      }
    }
  })
  app.use(await createKoaMiddleware(swaggerIndexFile))
  return app
}
```