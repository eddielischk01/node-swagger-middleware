module.exports = {
  testEnvironment: "node",
  testRegex: "__tests__/.*.test.js$",
  coverageThreshold: {
    global: {
      statements: 100,
      branches: 89,
      lines: 100,
      functions: 100
    }
  },
  collectCoverageFrom: ["lib/**/*.js"]
}
