import React, {Component} from 'react';
import marked from 'marked';

import MdInput from './md-input';
import MdOutput from './md-output';

import './app.css';

export default class MdParser extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    return <md-parser>
      <MdInput onReparse={({target: {value: input}}) => this.setInput(input)} />
      <MdOutput>{this.state.output || ''}</MdOutput>
    </md-parser>;
  }

  setInput(input = '') {
    const mdHtml = marked(input, {breaks: true});
    this.setState({output: mdHtml});
  }
}

