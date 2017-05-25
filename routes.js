import webpack from 'webpack';
import Koa from 'koa';
import mount from 'koa-mount';
import serve from 'koa-static';
import {green, blue, gray} from 'chalk';
import IndexHtml from 'html-webpack-plugin';
import {readFile, writeFile} from 'fs';
import cheerio from 'cheerio';

import {socket} from './server';
import bundler from './webpack.client.config';

const routes = {notes: ''};

export default Object.entries(routes).map(([name, src]) => {
  const app = new Koa();
  const cwd = `${process.cwd()}/${name}/`;

  bundler.entry[name] = `${cwd}/app.js`;
  // expose as a library for other bundles to use
  bundler.output.library = name;
  bundler.plugins.push(new IndexHtml({
    template: `${cwd}/index.html`,
    filename: `${name}/index.html`,
    chunks: [name],
    inject: false,
  }));

  try {
    const route = require(`./${name}/`);
    app.use(route);
  } catch(err) {}

  return (() => {
    app.use(serve(`dist/${name}/`));
    return mount(`/${src}`, app);
  });
});

// compile the module with webpack
const bundle = webpack(bundler);

bundle.watch({}, (err, stats) => {
  if(err) {
    console.error(err.stack || err);
    if(err.details) {
      console.error(err.details);
    }
    return;
  }

  const {hash, time, warnings, errors, entrypoints} = stats.toJson({
    assets: false,
    cached: false,
    cachedAssets: false,
    children: false,
    chunks: false,
    chunkModules: false,
    chunkOrigins: false,
    entrypoints: true,
    modules: false,
    publicPath: false,
    reasons: false,
    source: false,
    version: false,
  });

  console.log(green('Bundle'), blue(hash), green('finished in'),
    gray(`${time} ms`));
  socket.emit('hot-update');

  if(stats.hasErrors()) {
    console.error(errors);
    return;
  }

  if(stats.hasWarnings()) {
    console.warn(warnings);
  }

  for(const entry of Object.keys(entrypoints)) {
    const indexFile = `dist/${entry}/index.html`;

    readFile(indexFile, (err, indexHtml) => {
      const $ = cheerio.load(indexHtml);

      const baseFolder = $('base').attr('href') || '';

      $(`[entry=${entry}]`).attr('src', `${baseFolder}/${hash}/app.js`);

      indexHtml = $.html();

      writeFile(indexFile, indexHtml, () => {
        // do nothing, just need the callback
      });
    });
  }
});
