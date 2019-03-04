class ValidationError extends Error {
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

class AJVValidationError extends Error {
  constructor(ajvError) {
    super(
      ajvError
        .map((error, index) => {
          return `Error ${index}
${JSON.stringify(error, null, 4)}`
        })
        .join("\n\n")
    )
    this.errors = ajvError.errors
  }
}

class SpecNotFoundError extends Error {
  constructor(method, path) {
    super(`No matched spec found for ${method} ${path}`)
  }
}

module.exports = {
  ValidationError,
  SpecNotFoundError,
  AJVValidationError
}
