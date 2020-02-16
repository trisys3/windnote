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

const jsLoader = {
  test: /\.js$/,
  exclude: /node_modules/,
  loader: 'babel-loader',
  options: {
    cacheDirectory: true,
  },
};

const cssLoader = {
  test: /\.css$/,
  use: [
    {
      loader: 'css-loader',
      options: {
        sourceMap: true,
        importLoaders: 1,
        import: false,
        modules: true,
      },
    },
    'postcss-loader',
  ],
};

if(process.env.nodeEnv === 'production') {
  cssLoader.use.unshift({
    loader: 'file-loader',
    options: {
      name: '[name].[ext]',
    },
  },
  'extract',);
} else {
  cssLoader.use.unshift('style-loader');
}

const imgLoader = {
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
};

const htmlLoader = {
  test: /\.html$/,
  loader: 'html-loader',
  options: {
    minimize: true,
  },
};

const textLoader = {
  test: /\.txt$/,
  loader: 'raw-loader',
};

const loaders = [
  jsLoader,
  cssLoader,
  imgLoader,
  htmlLoader,
  textLoader,
];

export default {
  mode: options.nodeEnv,
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
