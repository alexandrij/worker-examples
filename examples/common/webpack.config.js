const defaultWebpackConfig = require('../../config/webpack.config');

module.exports = function (webpackEnv, argv) {
  return defaultWebpackConfig(webpackEnv, argv);
};
