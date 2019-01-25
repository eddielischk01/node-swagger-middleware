module.exports.ValidationError = class ValidationError extends Error {
  constructor(swayError) {
    super(
      swayError.errors
        .map((error, index) => {
          return `Error ${index}
${JSON.stringify(error, null, 4)}`
        })
        .join("\n\n")
    )
    this.errors = swayError.errors
  }
}

module.exports.SpecNotFoundError = class SpecNotFoundError extends Error {
  constructor(method, path) {
    super(`No matched spec found for ${method} ${path}`)
  }
}
