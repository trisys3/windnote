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
import {socket} from './server';

const routes = {notes: ''};

// export default routes.map(({name = '', src = ''}) => {
export default Object.entries(routes).map(([name, src]) => {
  const app = new Koa();
  const cwd = `${process.cwd()}/${name}/`;

  bundler.entry[name] = `${cwd}/app.js`;
  // expose as a library for other bundles to use
  bundler.output.library = name;

  try {
    const route = require(`./${name}/`);
    app.use(route);
  } catch(err) {}

  // if(typeof route === 'function') {
  //   app.use(route());
  // }

  app.use(serve(`dist/${name}/`));

  return mount(`/${src}`, app);
});

let hotUpdWatch;

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

  console.log(green('Compilation'), blue(hash),
    green('finished in'), gray(`${time} ms`));

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

      writeFile(indexHash, indexHtml, () => {
        // do nothing, just need the callback
      });
      writeFile(indexBase, baseHtml, () => {
        // do nothing, just need the callback
      });
    });
  }

  if(hotUpdWatch) {
    console.log(green('Closing previous webpack compilation...'));
    hotUpdWatch.close();
  }

  // watch all hot update files in the compilation folder
  hotUpdWatch = watch('**.hot-update.json', {
    cwd: `${process.cwd()}/dist`,
    // ignore hidden files
    ignored: /^\./,
  });

  socket.on('connection', io => {
    // whenever a hot-update file gets created, emit a hot-update
    // event to all sockets already connected to this page
    hotUpdWatch.on('add', () => {
      console.log(green('File changed'));
      io.emit('hot-update');
    });
  });
});
