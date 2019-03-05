const { deepFindByKey } = require("../index")
describe("Test utils", () => {
  it("Should extract value from nested object", () => {
    const input = {
      content: {
        foo: "bar",
        "plain/text": {
          foo: "bar"
        },
        "application/json": {
          schema: {
            foo: "bar"
          }
        }
      }
    }
    const result = deepFindByKey("schema")(input)
    expect(result).toEqual({
      foo: "bar"
    })
  })

  it("Should extract value from simple object", () => {
    const input = {
      schema: {
        foo: "bar"
      }
    }
    const result = deepFindByKey("schema")(input)
    expect(result).toEqual({
      foo: "bar"
    })
  })
})
