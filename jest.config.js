/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverageFrom: ['src/**/*.ts'],
  testPathIgnorePatterns: ['src/__tests__/test.server.ts'],
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
  // modulePaths: ['node_modules', '<rootDir>/src/'],
  // roots: ['node_modules', '<rootDir>/src/'],
  // modulePaths: ['node_modules', '<rootDir>/src/'],
  // moduleDirectories: ['node_modules', 'src'],
  roots: ['<rootDir>/src/'],
  transform: { '^.+\\.ts?$': 'ts-jest' },
  moduleNameMapper: {
    '@config/(.*)': '<rootDir>/src/config/$1',
    '@entities/(.*)': '<rootDir>/src/entities/$1',
    '@helpers': '<rootDir>/src/helpers/index.ts',
    '@helpers/(.*)': '<rootDir>/src/helpers/$1',
    '@middlewares': '<rootDir>/src/middlewares/index.ts',
    '@middlewares/(.*)': '<rootDir>/src/middlewares/$1',
    '@seeders/(.*)': '<rootDir>/src/seeders/$1',
    '@services/(.*)': '<rootDir>/src/services/$1',
    '@tasks/(.*)': '<rootDir>/src/tasks/$1',
    '@types/(.*)': '<rootDir>/src/tasks/$1',
  },
  setupFilesAfterEnv: ['./jest.setup.js'],
};
