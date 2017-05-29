'use strict';

import React from 'react';
import marked from 'marked';

import {MdInput} from './md-input';
import {MdOutput} from './md-output';

import './app.css';

export default class MdParser extends React.Component {
  constructor() {
    super();
    this.state = {
      output: '',
    };
  }

  render() {
    return <md-parser>
      <MdInput onReparse={({target: {value: input}}) => this.setInput(input)} />
      <MdOutput>{this.state.output}</MdOutput>
    </md-parser>;
  }

  setInput(input) {
    const mdHtml = marked(input, {breaks: true});
    this.setState({output: mdHtml});
  }
}

