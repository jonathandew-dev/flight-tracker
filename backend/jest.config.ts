// jest.config.ts
import type { JestConfigWithTsJest } from "ts-jest";

const config: JestConfigWithTsJest = {
  preset: "ts-jest/presets/default-esm", // ESM + ts-jest
  testEnvironment: "node",
  roots: ["<rootDir>/src/__tests__"],
  extensionsToTreatAsEsm: [".ts"], // treat TS files as ESM
  moduleFileExtensions: ["ts", "js", "json", "node"],
};

export default config;