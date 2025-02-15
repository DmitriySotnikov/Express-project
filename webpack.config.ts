import nodeExternals from 'webpack-node-externals';
import path from 'path';

/**
 * @description Webpack configuration file for build the server in production or development mode.
*/

const isDev: boolean = process.env.NODE_ENV === 'development';

module.exports = {
  mode: isDev ? 'development' : 'production',
  watch: false,
  entry: './src/app.ts',
  target: 'node',
  externals: [nodeExternals()],
  output: {
    filename: 'server.js',
    path: isDev ? path.join(__dirname, '/dist/dev') : path.join(__dirname, '/dist/prod'),
  },
  resolve: {
    extensions: ['.ts', '.js', '.json', '.svg'],
  },
  devtool: isDev ? 'eval-source-map' : false,
  module: {
    rules: [
      {
        test: /\.ts?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
        },
      },
      {
        test: /\.ts?$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
      },
    ],
  },
};
