import React, {Component} from 'react';

export class MdDesc extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    this.toggleDesc = this.toggleDesc.bind(this);

    return <md-desc>
      <p>You can also write in MarkDown: <a onClick={this.toggleDesc}>Cheatsheet</a></p>
      <md-cheats style={{display: this.state.showDesc ? 'block' : 'none'}}>
        <p>*text* - <i>Italics</i></p>
        <p>**text** - <b>Bold</b></p>
        <p>[URL](description text) - <a>link</a></p>
      </md-cheats>
    </md-desc>
  }

  toggleDesc() {
    this.setState({showDesc: !this.state.showDesc});
  }
};
