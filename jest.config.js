export const preset = "ts-jest";
export const testEnvironment = "node";
export const roots = ["<rootDir>/src"];
export const testMatch = ["**/__tests__/**/*.ts", "**/?(*.)+(spec|test).ts"];
export const transform = {
  "^.+\\.ts$": "ts-jest",
};
export const coverageDirectory = "coverage";
export const collectCoverageFrom = ["src/**/*.ts", "!src/**/*.d.ts"];
