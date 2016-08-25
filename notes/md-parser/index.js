'use strict';

import React from 'react';

import {MdInput} from './md-input';
import {MdOutput} from './md-output';

import './app.styl';

export function MdParser() {
  return <md-parser>
    <MdInput />
    <MdOutput />
  </md-parser>;
}
