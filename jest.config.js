module.exports = {
    testEnvironment: 'jest-fixed-jsdom',
    setupFiles: ['<rootDir>/jest.polyfills.js'],
    setupFilesAfterEnv: ['<rootDir>/src/tests/setup.js'], 
    transform: {
      '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
    },
    moduleNameMapper: {
      '\\.(css|less|scss)$': 'identity-obj-proxy',
    },
    transformIgnorePatterns: [
      '/node_modules/(?!msw|other-libraries-you-need-to-transform)/',
    ], 
  };
  