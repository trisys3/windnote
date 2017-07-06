import 'react-hot-loader/patch';
import {AppContainer} from 'react-hot-loader';
import io from 'socket.io-client';
const socket = io(__dirname);

import React from 'react';
import {render} from 'react-dom';

import './app.css';
import NotesPage from './notes-page';

const notesParser = document.querySelector('notes-page');
const reactReload = () => render(<AppContainer>
  <NotesPage />
</AppContainer>, notesParser);

reactReload();

if(module.hot) {
  module.hot.accept();

  module.hot.accept('./notes-page', () => reactReload());

  socket.once('hot-update', () => {
    module.hot.check(true);
  });
}
