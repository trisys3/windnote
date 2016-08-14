'use strict';

import webpack from 'webpack';
import {watch} from 'chokidar';
import {readFileSync} from 'fs';
import mime from 'mime';
import bundler from '../webpack.client.config';
import {socket, options} from '../config';
import {green} from 'chalk';

export default homePage;

function homePage() {
  // compile the module with webpack
  webpack(bundler, () => {
    // watch all hot update files in the compilation folder
    const hotUpdWatch = watch('*.hot-update.json', {
      cwd: `${process.cwd()}/frontend/${options.env}`,
      // ignore hidden files
      ignored: /^\./,
    });

    socket.on('connection', io => {
      // whenever a hot-update file gets created, emit a hot-update event to all
      // sockets connected to this page
      hotUpdWatch.on('add', () => {
        console.log(green('File changed'));

        io.emit('hot-update');
      });
    });
  });

  return (ctx, next) => {
    // we only deal with GET requests here
    if(ctx.method !== 'GET') {
      return next();
    }

    if(ctx.path === '/' || ctx.path === '/index.html') {
      ctx.type = 'html';
      ctx.body = readFileSync(`${process.cwd()}/frontend/${options.env}/index.html`, 'utf-8');
    }
    else {
      ctx.type = mime.lookup(ctx.path);
      ctx.body = readFileSync(`${process.cwd()}/frontend/${options.env}/${ctx.path}`, 'utf-8');
    }

    return next();
  };
}
