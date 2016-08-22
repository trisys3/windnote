'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

function MdInput() {
  return <div />;
}

function MdOutput() {
  return <div />;
}

function MdParser() {
  return <div>
    <MdInput />
    <MdOutput />
  </div>;
}

ReactDOM.render(
    <MdParser />,
    document.querySelector('md-parser'),
);
