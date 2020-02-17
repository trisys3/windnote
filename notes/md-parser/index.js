const parserStyles = {
  flexGrow: 1,
  display: 'flex',
};

const inputStyles = {marginRight: 5};

import {useState} from 'react';
/** @jsx jsx */
import {jsx} from '@emotion/core';
import marked from 'marked';

import MdInput from './md-input';
import MdOutput from './md-output';

export default function MdParser() {
  const [output = '', setOutput] = useState();

  return <div css={parserStyles}>
    <MdInput css={inputStyles} onReparse={onReparse} />
    <MdOutput>{output}</MdOutput>
  </div>;

  function onReparse({target: {value: input}}) {
    setInput(input);
  }

  function setInput(input = '') {
    const mdHtml = marked(input, {breaks: true});
    setOutput(mdHtml);
  }
}
