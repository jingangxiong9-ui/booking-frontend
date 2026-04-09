const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

const existingBlockList = [].concat(config.resolver.blockList || []);

config.resolver.blockList = [
  ...existingBlockList,
  /.*\/\.expo\/.*/,
  /.*\/react-native\/ReactAndroid\/.*/,
  /.*\/react-native\/ReactCommon\/.*/,
  /.*\/@typescript-eslint\/eslint-plugin\/.*/,
  /.*\/caniuse-lite\/data\/.*/,
  /.*\/__tests__\/.*/,
  /.*\.git\/.*/,
  /.*node_modules\/\.pnpm\/.*_tmp_\d+.*/,
];

module.exports = config;
