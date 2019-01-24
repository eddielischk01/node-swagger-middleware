module.exports = {
  linters: {
    "*.js": ["prettier --write", "yarn lint", "git add"]
  }
}
