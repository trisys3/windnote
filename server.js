// third-party components
import {green, gray, magenta, cyan, red} from 'chalk';
import Koa from 'koa';
import logger from 'koa-logger';
import compress from 'koa-compress';
import helmet, {contentSecurityPolicy as csp} from 'koa-helmet';
import {createServer} from 'http';
import Sockets from 'socket.io';
import serveStatic from 'koa-static';
import mount from 'koa-mount';

const socket = new Sockets();

// Content-Security-Policy configuration
const cspConf = {
  directives: {
    // by default only allow connections from our sites
    defaultSrc: ["'self'"],
    // only allow JavaScript code from our sites
    scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
    // only allow CSS styles from our sites
    styleSrc: ["'self'", 'blob:', "'unsafe-inline'"],
    // only allow images from our sites and data-uri's
    imgSrc: ["'self'", 'data:'],
    // only allow partial-page connections (XHR, WebSockets, etc.) from our
    // sites
    connectSrc: ["'self'", `ws://localhost:${options.clientPort}`],
    // only allow fonts from our sites
    fontSrc: ["'self'"],
    // do not allow Flash on our sites
    objectSrc: ["'none'"],
    // do not allow embedding of <iframe>s in our sites
    frameSrc: ["'none'"],
    // only allow video & audio from our sites
    mediaSrc: ["'self'"],
    // URL to send reports of violations to
    reportUri: '/csp-report',
  },
  reportOnly: true,
};

// first-party components
import options from './config';
import routes from './routes';

// our main koa & SocketIO servers
export const server = new Koa();

// give the server a name
server.name = options.name;

// set the phase of development for the app
server.env = options.nodeEnv;

// CSP endpoint
server.use(({request: req, path, method, response: res}, next) => {
  if(method !== 'POST' || path !== '/csp-report') {
    return next();
  }

  const viol = req.body || 'No data received!';
  console.log(`CSP Violation: ${viol}`);

  res.status = 204;
});

// compression middleware
server.use(compress());

// our JSONAPI logger
server.use(logger({
  name: options.name,
  path: 'logs/windnote-logger',
}));

// add certain headers for protection
server.use(helmet({noSniff: false}));
server.use(csp(cspConf));

export {serve, stop, socket};

for(const route of routes) {
  // TODO: pass the exact room/namespace
  server.use(route());
}

const hotUpdRoutes = new Koa();
hotUpdRoutes.use(serveStatic('dist/hot-update'));
server.use(mount('/hot-update', hotUpdRoutes));

// create a NodeJS server with the content of our koa application
const app = createServer(server.callback());
socket.listen(app);

if(process.argv[1] === `${__dirname}/${__filename}`) {
  // if we are the called file, start the server
  serve();
}

function serve() {
  // log some general information about the application
  console.log(green('Application'), cyan(options.name),
    green('port'), gray(options.port), green('started at'),
    red(new Date()));
  console.log(green('Environment:'), magenta(options.nodeEnv));
  console.log(green('Hostname(s):'), cyan(options.hostname));

  // have all server components listen
  app.listen(options.port);
}

function stop() {
  console.log(green(`Application ${cyan(options.name)}, port ${gray(options.port)} stopped at ${red(new Date())}`));

  app.close();
}
