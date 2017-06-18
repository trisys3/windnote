'use strict';

import React, {Component} from 'react';
import marked from 'marked';

import {MdInput} from './md-input';
import {MdOutput} from './md-output';

import './app.css';

export default class MdParser extends Component {
  constructor() {
    super();
    this.state = {
      output: '',
    };
  }

  render() {
    this.toggleDesc = this.toggleDesc.bind(this);

    return <md-parser>
      <header>
        <h1>WindNote</h1>
        <h2>Write like the wind!</h2>

        <div>
          <p>You can also write in MarkDown: <a onClick={this.toggleDesc}>Cheatsheet</a></p>
          <div style={{display: this.state.showDesc ? 'block' : 'none'}}>
            <p>*text* - <i>Italics</i></p>
            <p>**text** - <b>Bold</b></p>
            <p>[URL](description text) - <a>link</a></p>
          </div>
        </div>
      </header>

      <MdInput onReparse={({target: {value: input}}) => this.setInput(input)} />
      <MdOutput>{this.state.output}</MdOutput>
    </md-parser>;
  }

  setInput(input = '') {
    const mdHtml = marked(input, {breaks: true});
    this.setState({output: mdHtml});
  }

  toggleDesc() {
    this.setState({showDesc: !this.state.showDesc});
  }
}

