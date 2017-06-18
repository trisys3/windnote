'use strict';

import React from 'react';

import './app.css';

export default class MdOutput extends React.Component {
  render() {
    const outputHtml = {__html: this.output};
    return <md-output hidden={this.hidden} dangerouslySetInnerHTML={outputHtml} />;
  }

  componentWillMount() {
    const {hidden, children: output} = this.props;
    Object.assign(this, {hidden, output});
  }

  componentWillReceiveProps({hidden, children: output}) {
    Object.assign(this, {hidden, output});
  }
}
