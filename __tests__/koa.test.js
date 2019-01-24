const request = require("supertest")
const { createKoaApp } = require("./koaApp")

describe("Test KOA Middleware", () => {
  let app
  beforeEach(async () => {
    app = await createKoaApp()
  })
  test("Get a path has described on OpenAPI", async () => {
    const response = await request(app.callback()).get(
      "/v1/whoami?name=davidng"
    )
    expect(response.status).toEqual(200)
  })

  test("Get a path has described on OpenAPI but missing parameter", async () => {
    const response = await request(app.callback()).get("/v1/whoami")
    expect(response.status).toEqual(400)
  })

  test("Get a path not described on OpenAPI", async () => {
    const response = await request(app.callback()).get("/echo")
    expect(response.status).toEqual(200)
  })

  test("Get a path has described on OpenAPI but response schema not match", async () => {
    const response = await request(app.callback()).get(
      "/v1/response-schema-mismatch?name=davidng"
    ) // Not work
    expect(response.status).toEqual(400)
  })
})
