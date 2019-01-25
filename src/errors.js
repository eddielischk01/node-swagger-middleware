module.exports.ValidationError = class ValidationError extends Error {
  constructor(swayError) {
    super(
      swayError.errors
        .map(error => {
          return `${error.path} ${error.message}`
        })
        .join("\n\n")
    )
  }
}

module.exports.SpecNotFoundError = class SpecNotFoundError extends Error {
  constructor(method, path) {
    super(`No matched spec found for ${method} ${path}`)
  }
}
