'use strict';

import React from 'react';

import './app.css';

export default function MdInput({onReparse}) {
  return <md-input>
    <textarea onInput={onReparse} autoComplete="on" placeholder="My notes" />
  </md-input>;
}
