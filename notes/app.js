// connect to the home SocketIO namespace
import {AppContainer} from 'react-hot-loader';
import io from 'socket.io-client';
const socket = io(__dirname);

import React from 'react';
import {render} from 'react-dom';

import MdParser from './md-parser';
import './app.css';

const notesParser = document.querySelector('notes-parser');
const reactReload = () => render(<AppContainer>
  <MdParser />
</AppContainer>, notesParser);

reactReload();

if(module.hot) {
  module.hot.accept();

  module.hot.accept('./md-parser', reactReload());

  socket.once('hot-update', () => {
    module.hot.check(true);
  });
}
