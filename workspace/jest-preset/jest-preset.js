module.exports = {
  testRegex: '.*\\.(unit|i9n|e2e)\\.ts$',
  reporters: ['default', 'github-actions'],
  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest',
  },
};
