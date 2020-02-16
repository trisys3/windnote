'use strict';

const cssnext = require('postcss-preset-env');
const cssImport = require('postcss-import');
const nano = require('cssnano');

exports.plugins = [
  cssImport(),
  cssnext(),
  nano(),
];
