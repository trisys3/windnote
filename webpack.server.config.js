#! /usr/bin/env node

'use strict';

const {red, blue, green, cyan, gray, yellow} = require('chalk');
const {join, extname} = require('path');
const pkg = require(join(process.cwd(), 'package.json'));
const webpack = require('webpack');
const options = require('./config');

const deps = Object.assign({}, pkg.dependencies, pkg.devDependencies);
const nodeModules = {};

for(const dep of Object.keys(deps)) {
  nodeModules[dep] = `commonjs ${dep}`;
}

const loaders = [{
  test: /\.node$/,
  loader: 'node-loader',
}, {
  test: /\.js$/,
  exclude: /node_modules/,
  loader: 'babel-loader',
  options: {
    cacheDirectory: true,
  },
}];

const config = {
  mode: options.nodeEnv,
  entry: {
    server: './server.js',
  },
  output: {
    filename: '[name].js',
    chunkFilename: 'chunks/[chunkhash]/chunk.js',
    path: `${process.cwd()}/dist`,
    pathinfo: options.nodeEnv === 'development',
    libraryTarget: 'commonjs2',
  },
  module: {
    rules: loaders,
  },
  resolve: {
    extensions: ['.js', '.json'],
  },
  target: 'node',
  externals: nodeModules,
  plugins: [
    new webpack.BannerPlugin({
      banner: 'require("source-map-support").install();',
      raw: true,
      entryOnly: false,
    }),
  ],
  node: {
    global: false,
    process: false,
    Buffer: false,
    __filename: true,
    __dirname: true,
    setImmediate: false,
  },
  watch: true,
  devtool: 'source-map',
};

Object.assign(exports, config);

if(process.argv[1] === __filename) {
  const servers = [];
  webpack(config)
    .watch({}, (err, stats) => {
      const assets = Object.keys(stats.compilation.assets);
      const outputFolder = stats.compilation.outputOptions.path;

      if(err) {
        console.error(err.stack || err);
        if(err.details) {
          console.error(err.details);
        }
        return;
      }

      const {hash, time, warnings, errors, entrypoints: entryData} = stats.toJson({
        assets: false,
        cached: false,
        cachedAssets: false,
        children: false,
        chunks: false,
        chunkModules: false,
        chunkOrigins: false,
        modules: false,
        publicPath: false,
        reasons: false,
        source: false,
        version: false,
        colors: true,
      });

      const entries = Object.keys(entryData);
      const entryList = entries.join(', ');

      let timeStr = `${time}ms`;
      if(time >= 1000) {
        const secStr = (time / 1000).toFixed(1);
        const sec = Number(secStr);
        timeStr = `${sec}s`;
      }

      console.log(green(blue(hash),
        `(${cyan(entryList)})`,
        'bundled in',
        gray(timeStr)));

      if(stats.hasErrors()) {
        console.error(red(errors));
      }

      if(stats.hasWarnings()) {
        console.warn(yellow(warnings));
      }

      if(!assets.filter(allEntries => extname(allEntries) === '.js').length) {
        console.log(red('No usable assets found. Either you did not specify any entry points in JavaScript or compilable to JavaScript, or you have an error in your entry point(s).'));
        process.exit();
      }

      const newServers = assets.map(asset => `${outputFolder}/${asset}`)
        .filter(allEntries => extname(allEntries) === '.js')
        .map(entry => {
          const newServer = require(entry);

          if(servers.length) {
            // assume only 1 server per watch
            const prevServer = servers[servers.length - 1];

            if(prevServer) {
              prevServer.stop();
            }
          }

          newServer.serve();

          return newServer;
        });

      servers.push(...newServers);
    });
}
