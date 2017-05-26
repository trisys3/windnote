// connect to the home SocketIO namespace
import io from 'socket.io-client';
const socket = io(__dirname);

import React from 'react';
import {render} from 'react-dom';

import {MdParser} from './md-parser';
import './app.css';

if(module.hot) {
  module.hot.accept();

  module.hot.accept('./md-parser', () => {
    const MdContainer = require('./md-parser').default;
    render(<MdContainer />, document.querySelector('notes-parser'));
  });

  socket.once('hot-update', () => {
    module.hot.check(true);
  });
}

render(<MdParser />, document.querySelector('notes-parser'));
