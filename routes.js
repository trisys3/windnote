import {join} from 'path';
import webpack from 'webpack';
import {watch} from 'chokidar';
import Koa from 'koa';
import mount from 'koa-mount';
import serve from 'koa-static';
import {green, blue, gray} from 'chalk';
import {readFile, writeFile} from 'fs';
import cheerio from 'cheerio';

import bundler from './webpack.client.config';

const hotUpdWatch = {};

const routes = {notes: ''};

export default Object.entries(routes).map(([name, src]) => {
  const app = new Koa();
  const cwd = `${process.cwd()}/${name}/`;

  bundler.entry[name] = `${cwd}/app.js`;
  // expose as a library for other bundles to use
  bundler.output.library = name;

  hotUpdWatch[name] = watch(`${name}/**.json`, {
    cwd: 'dist',
    ignored: /^\./,
  })
    .on('add', () => console.log('bundle changed'));

  try {
    const route = require(`./${name}/`);
    app.use(route);
  } catch(err) {}

  return socket => {
    // whenever a hot-update file gets created, emit a hot-update
    // event to all sockets already connected to this page
    socket.on('connection', io => hotUpdWatch[name].on('add', () =>
      io.emit('hot-update')));

    app.use(serve(`dist/${name}/`));
    return mount(`/${src}`, app);
  };
});

// compile the module with webpack
webpack(bundler, (err, stats) => {
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

  if(stats.hasErrors()) {
    console.error(errors);
    return;
  }

  if(stats.hasWarnings()) {
    console.warn(warnings);
  }

  for(const entry of Object.keys(entrypoints)) {
    const indexSrc = `${entry}/index.html`;
    const indexHash = `dist/${entry}/${hash}/index.html`;
    const indexBase = `dist/${entry}/index.html`;

    readFile(indexSrc, (err, indexHtml) => {
      const $ = cheerio.load(indexHtml);

      let base = $('head base');
      if(!base.length) {
        $('head').append('<base />');
        base = $('head base');
      }

      // use the original path
      const baseBase = base.attr('href') || '';
      // we need a trailing slash here for some reason
      base.attr('href', join(baseBase, hash, '/'));

      const baseHtml = $.html();

      // write the original HTML to the base of the bundle folder...
      writeFile(indexHash, indexHtml, () => {
        // do nothing, just need the callback
      });
      // and add the hash to the <base> in the hash folder
      writeFile(indexBase, baseHtml, () => {
        // do nothing, just need the callback
      });
    });
  }
});
