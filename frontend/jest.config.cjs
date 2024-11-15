 
module.exports = {
  preset: "ts-jest",
  collectCoverageFrom: ['<rootDir>/src/**/*.{js,jsx,ts,tsx}', '!src/**/*.d.ts'],
  moduleDirectories: ['node_modules'],
  moduleFileExtensions: ['js', 'mjs', 'jsx', 'ts', 'tsx', 'json'],
  moduleNameMapper: {
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png)$': '<rootDir>/__mocks__/imageMock.cjs'
  },
  notify: true,
  notifyMode: 'success-change',
  resetMocks: true,
  roots: ['<rootDir>'],
  setupFiles: [
    '<rootDir>/src/test/setupMockEnv.ts'
  ],
  setupFilesAfterEnv: [
    '<rootDir>/src/test/setupTests.ts'],
  // adds support for TypeScript
  // using ts-jest
  transform: {
    '^.+\\.(tsx|ts)?$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
      isolatedModules: true,
      
    }],
    '^.+\\.(js|jsx)?$': 'babel-jest'
  },
  transformIgnorePatterns: [],
   // set test environment
  'testEnvironment': 'jsdom',

  testTimeout: 20000,

  // Test spec file resolution pattern
  // Matches parent folder `__tests__` and filename
  // should contain `test` or `spec`.
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$'

}