'use strict';

import React from 'react';

import './app.css';

export default function MdOutput({children: output, hidden}) {
  const outputHtml = {__html: output};
  return <md-output hidden={hidden} dangerouslySetInnerHTML={outputHtml} />;
}
