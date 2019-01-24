module.exports = {
  testEnvironment: "node",
  testRegex: "__tests__/.*.test.js$",
  coverageThreshold: {
    global: {
      statements: 90,
      branches: 80,
      lines: 90,
      functions: 85
    }
  },
  collectCoverageFrom: ["src/**/*.js"]
}
