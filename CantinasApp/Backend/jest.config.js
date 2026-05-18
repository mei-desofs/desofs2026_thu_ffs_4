module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  testMatch: ["**/__tests__/**/*.ts", "**/?(*.)+(spec|test).ts"],
  moduleFileExtensions: ["ts", "js", "json"],
  collectCoverageFrom: [
    "src/utils/date.ts",
    "src/utils/unitConversion.ts",
    "src/Config/db.ts",
    "src/Model/**/*.ts",
    "!src/**/*.d.ts",
    "!src/**/tests/**",
    "!src/**/*.test.ts",
  ],
  coverageDirectory: "coverage",
  coveragePathIgnorePatterns: [
    "<rootDir>/src/Controller/",
    "<rootDir>/src/Routes/",
    "<rootDir>/src/Model/",
    "<rootDir>/src/Jobs/",
    "<rootDir>/src/middlewares/",
    "<rootDir>/src/Service/",
    "<rootDir>/src/Bootstrap.ts",
    "<rootDir>/src/Schemas/",
  ],
  coverageReporters: ["text", "lcov", "html", "json-summary"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  globals: {
    "ts-jest": {
      tsconfig: {
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
      },
    },
  },
};
