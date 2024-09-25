module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src'],
    testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
    transform: {
      '^.+\\.ts$': ['ts-jest', {
        tsconfig: 'tsconfig.json',
        useESM: true,
      }],
    },
    moduleNameMapper: {
      '^@ntla9aw/(.*)$': '<rootDir>/../../packages/$1',
    },
    extensionsToTreatAsEsm: ['.ts'],
    moduleFileExtensions: ['ts', 'js', 'json', 'node'],
    globalSetup: '<rootDir>/jest.setup.js',
  };