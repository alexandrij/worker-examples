const path = require('path');
const { DefinePlugin } = require('webpack');

module.exports = function (webpackEnv, argv) {
  const appPath = path.resolve('.');
  const appSrc = path.resolve(appPath, 'src');
  // const appCache = path.resolve(appPath, 'node_modules/.cache');
  const appNodeModules = path.resolve(appPath, '../../node_modules');
  const tsConfigFilePath = path.resolve(appPath, 'tsconfig.json');
  const outPath = path.resolve(appPath, 'dist');

  const isEnvProduction = argv.mode === 'production';
  const isEnvDevelopment = argv.mode === 'development';
  const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';

  if (isEnvDevelopment) {
    process.env.BABEL_ENV = 'development';
    process.env.NODE_ENV = 'development';
  } else {
    process.env.BABEL_ENV = 'production';
    process.env.NODE_ENV = 'production';
  }

  const port = argv.port || '8080';

  const babelLoader = {
    loader: 'babel-loader',
    options: {
      presets: [
        [
          require('@babel/preset-env').default,
          {
            targets: {
              node: 'current',
            },
          },
        ],
        [require('@babel/preset-typescript').default],
      ],
      babelrc: false,
      configFile: false,
      cacheDirectory: true,
      cacheCompression: false,
      compact: isEnvProduction,
    },
  };

  return {
    // target: ['browserlist'],
    stats: true,
    mode: isEnvProduction ? 'production' : isEnvDevelopment && 'development',
    bail: isEnvProduction,
    devtool: shouldUseSourceMap ? 'cheap-module-source-map' : false,
    optimization: {
      minimize: isEnvProduction,
    },
    watchOptions: {
      followSymlinks: true,
    },
    devServer: {
      host: 'localhost',
      port: port,
      headers: {
        'Cross-Origin-Opener-Policy': 'same-origin',
        'Cross-Origin-Embedder-Policy': 'require-corp',
      },
    },
    context: appPath,
    entry: {
      index: [path.resolve(appSrc, 'index.ts')],
    },
    output: {
      path: outPath,
      filename: '[name].js',
      pathinfo: isEnvDevelopment,
      library: { type: 'umd' },
      clean: true,
    },
    resolve: {
      symlinks: false,
      extensions: ['.ts', '.tsx', '.js', '.json', '.css'],
      modules: [appNodeModules, appSrc],
    },
    module: {
      strictExportPresence: true,
      rules: [
        // Handle node_modules packages that contain sourcemaps
        shouldUseSourceMap && {
          enforce: 'pre',
          exclude: /@babel(?:\/|\\{1,2})runtime/,
          test: /\.(js|mjs|jsx|ts|tsx|css)$/,
          loader: require.resolve('source-map-loader'),
        },
        {
          // "oneOf" проходить через все loader'ы, пока не найдет соответствие.
          // Если не соответствует ни один loader, то loader - последний "file".
          oneOf: [
            {
              test: /\.(png|jpg|jpeg|gif)$/i,
              type: 'asset',
            },
            {
              test: /\.svg$/i,
              use: 'raw-loader',
            },
            {
              test: /\.(js|mjs|jsx|ts|tsx)$/,
              exclude: /node_modules/,
              use: [
                babelLoader,
                {
                  loader: 'ts-loader',
                  options: {
                    configFile: tsConfigFilePath,
                    transpileOnly: false,
                  },
                },
              ],
            },
            {
              test: /\.(css)$/,
              use: ['style-loader', 'css-loader'],
            },
            // Loader «file» гарантирует, что эти ресурсы будут обработаны WebpackDevServer.
            // Когда вы «импортируете» ресуры, вы получаете его (виртуальное) имя файла.
            // Этот loader не использует «test», поэтому он перехватывает все модули,
            // которые не проходят через другие loader'ы.
            {
              // Исключены `js`, `html` and `json`
              exclude: [/^$/, /\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
              type: 'asset/resource',
            },
          ],
        },
      ].filter(Boolean),
    },
    plugins: [
      new DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(argv.mode),
      }),
    ],
  };
};
