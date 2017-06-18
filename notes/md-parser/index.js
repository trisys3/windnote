import React, {Component} from 'react';
import marked from 'marked';

import {MdInput} from './md-input';
import {MdOutput} from './md-output';
import {MdDesc} from '../../md-desc';

import './app.css';

export default class MdParser extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    return <md-parser>
      <header>
        <h1>{'WindNote - Write like the wind!'}</h1>

        <MdDesc />
      </header>

      <MdInput onReparse={({target: {value: input}}) => this.setInput(input)} />
      <MdOutput>{this.state.output || ''}</MdOutput>
    </md-parser>;
  }

  setInput(input = '') {
    const mdHtml = marked(input, {breaks: true});
    this.setState({output: mdHtml});
  }
}

