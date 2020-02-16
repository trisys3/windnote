'use strict';

const env = require('postcss-preset-env');
const cssImport = require('postcss-import');
const nano = require('cssnano');

exports.plugins = [
  cssImport(),
  env({stage: 0}),
  nano(),
];
