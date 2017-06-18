import 'react-hot-loader/patch';
import {AppContainer} from 'react-hot-loader';
import io from 'socket.io-client';
const socket = io(__dirname);

import React from 'react';
import {render} from 'react-dom';

import MdParser from './md-parser';
import MdDesc from '../md-desc';
import './app.css';

const NotesPage = () => <notes-parser>
  <header>
    <h1>{'WindNote - Write like the wind!'}</h1>
    <MdDesc />
  </header>

  <MdParser />
</notes-parser>;

const notesParser = document.querySelector('notes-page');
const reactReload = () => render(<AppContainer>
  <NotesPage />
</AppContainer>, notesParser);

reactReload();

if(module.hot) {
  module.hot.accept();

  module.hot.accept('./md-parser', reactReload());

  socket.once('hot-update', () => {
    module.hot.check(true);
  });
}
