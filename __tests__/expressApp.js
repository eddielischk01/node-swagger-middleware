const express = require("express")
const { createExpressMiddleware } = require("../src")
const { ValidationError } = require("../src/errors")

module.exports.createExpressApp = async () => {
  const app = express()
  app.use(express.json())
  app.use(await createExpressMiddleware(`${__dirname}/fixtures/index.yml`))
  app.get("/v1/whoami", (req, res) => {
    const { name } = req.query
    res.send({
      name: "Unit Testing",
      purpose: "Middleware for integrate express and OpenAPI",
      whoareyou: name
    })
  })
  app.get("/v1/response-schema-mismatch", (req, res) => {
    const { name } = req.query
    res.send({
      name: "Unit Testing",
      purpose: "Middleware for integrate express and OpenAPI",
      whoareyou: name
    })
  })
  app.get("/echo", (req, res) => {
    res.send({})
  })
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
