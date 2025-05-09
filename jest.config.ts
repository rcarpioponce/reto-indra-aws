export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/__tests__/**/*.spec.ts'],
    collectCoverage: true,
    collectCoverageFrom: ['src/**/*.(t|j)s'],
    coverageReporters: ['text', 'lcov'],
  };
  