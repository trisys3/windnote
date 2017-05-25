import {HotModuleReplacementPlugin as HMR} from 'webpack';

import options from './config';

const minify = {};

minify.urls = {
  /* eslint camelcase: 0 */
  ignore_www: true,
};
minify.js = {

};
minify.css = {

};
minify.html = {
  removeComments: true,
  removeCommentsFromCDATA: true,
  removeCDATASectionsFromCDATA: true,
  collapseWhitespace: true,
  conservativeCollapse: true,
  collapseBooleanAttributes: true,
  removeAttributeQuotes: true,
  removeRedundantAttributes: true,
  useShortDoctype: true,
  removeEmptyAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
  removeOptionalTags: true,
  // minifyJS: minify.js,
  // minifyCSS: minify.css,
  minifyURLs: minify.urls,
};

export {minify};

const loaders = [{
  test: /\.js$/,
  exclude: /node_modules/,
  loader: 'babel-loader',
  options: {
    cacheDirectory: true,
  },
}, {
  test: /\.css$/,
  use: [
    'style-loader',
    {
      loader: 'css-loader',
      options: {
        sourceMap: true,
        importLoaders: 1,
        minimize: false,
        import: false,
        modules: true,
      },
    },
    'postcss-loader',
  ],
}, {
  test: /\.(png|jpe?g|gif|svg)$/i,
  use: [{
    loader: 'img-loader',
    options: {
      minimize: true,
    },
  }, {
    loader: 'url-loader',
    options: {
      name: '[sha512:hash].[ext]',
    },
  }],
}, {
  test: /\.html$/,
  loader: 'html-loader',
  options: {
    minimize: true,
  },
}, {
  test: /\.txt$/,
  loader: 'raw-loader',
}];

export default {
  entry: {},
  output: {
    filename: '[name]/[hash]/app.js',
    chunkFilename: '[name]/[hash].[chunkhash].js',
    hotUpdateMainFilename: 'hot-update/[hash].json',
    hotUpdateChunkFilename: 'hot-update/[id].[hash].json',
    path: `${process.cwd()}/dist`,
    pathinfo: options.nodeEnv === 'development',
  },
  module: {
    rules: loaders,
  },
  resolve: {
    extensions: ['.js', '.json'],
  },
  watch: true,
  devtool: 'source-map',
  plugins: [
    new HMR(),
  ],
};
