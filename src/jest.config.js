export const preset = 'ts-jest';
export const testEnvironment = 'node';
export const moduleFileExtensions = ['ts', 'tsx', 'js', 'jsx'];
export const testMatch = ['**/*.test.ts'];
export const transform = {
  '^.+\\.(ts|tsx)$': 'ts-jest',
};
export const testPathIgnorePatterns = ['/node_modules/', '/dist/'];
