import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest/presets/default-esm', 
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': ['ts-jest', { useESM: true }],
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1', 
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