module.exports = {
  preset: 'react-native',
  watchman: false,
  moduleNameMapper: {
    '^@env$': '<rootDir>/__mocks__/env.js',
    '^@react-native-async-storage/async-storage$':
      '<rootDir>/__mocks__/async-storage.js',
  },
};
