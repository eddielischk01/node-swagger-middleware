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
