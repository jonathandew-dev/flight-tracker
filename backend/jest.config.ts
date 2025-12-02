// export default {
//   preset: "ts-jest/presets/default-esm",
//   testEnvironment: "node",
//   roots: ["<rootDir>/src/__tests__"],
//   transform: {
//     "^.+\\.ts$": ["ts-jest", { tsconfig: "tsconfig.json" }],
//   },
//   moduleNameMapper: {
//     "^@/(.*)$": "<rootDir>/src/$1",
//   },
//   transformIgnorePatterns: [
//     "/node_modules/(?!(@prisma)/)", 
//   ],
//   extensionsToTreatAsEsm: [".ts"],
//   globals: {
//     "ts-jest": {
//       useESM: true,
//     },
//   },
// };

// jest.config.ts
// import type { JestConfigWithTsJest } from "ts-jest";

// const config: JestConfigWithTsJest = {
//   preset: "ts-jest/presets/default-esm", // ESM + ts-jest
//   testEnvironment: "node",
//   roots: ["<rootDir>/src/__tests__"],
//   extensionsToTreatAsEsm: [".ts"], // treat TS files as ESM
//   moduleFileExtensions: ["ts", "js", "json", "node"],
// };

// export default config;

// import type { Config } from '@jest/types';

// const config: Config.InitialOptions = {
//   preset: 'ts-jest/presets/default-esm', // ESM preset
//   testEnvironment: 'node',
//   transform: {
//     '^.+\\.ts$': ['ts-jest', { useESM: true }]
//   },
//   transformIgnorePatterns: ["node_modules/(?!@prisma/client)"],
//   extensionsToTreatAsEsm: ['.ts'],
//   moduleNameMapper: {
//     // remove .js from import paths in TypeScript ESM
//     '^(\\.{1,2}/.*)\\.js$': '$1'
//   },
//   globals: {
//     'ts-jest': {
//       useESM: true
//     }
//   }
// };

// export default config;
import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest/presets/default-esm', // <-- use default-esm preset to remove globals warning
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': ['ts-jest', { useESM: true }],
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1', // resolves ESM imports correctly
  },
  extensionsToTreatAsEsm: ['.ts'],
  globals: {
    'ts-jest':{
      useESM:true,
    }
  }, 
  setupFilesAfterEnv: ["<rootDir>/src/jest.setup.ts"],
};

export default config;