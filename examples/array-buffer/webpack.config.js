const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const defaultWebpackConfig = require('../../config/webpack.config');

const appPath = path.resolve('.');
const appSrc = path.resolve(appPath, 'src');

module.exports = function (webpackEnv, argv) {
  const defaultConfig = defaultWebpackConfig(webpackEnv, argv);

  return {
    ...defaultConfig,
    plugins: defaultConfig.plugins.concat([
      new HtmlWebpackPlugin({
        template: path.resolve(appSrc, 'index.html'),
        inject: true,
      }),
    ]),
  };
};
