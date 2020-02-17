const textboxStyles = {
  backgroundColor: 'wheat',
  fontFamily: 'inherit',
  fontSize: '1.25em',
  flexGrow: 1,
  border: 'none',
  padding: 5,
  width: 0,
  resize: 'none',
};

/** @jsx jsx */
import {jsx} from '@emotion/core';

export default function MdInput({className: outerClass, onReparse}) {
  return <textarea className={outerClass} css={textboxStyles} onInput={onReparse} autoComplete="on" placeholder="My notes" />;
}
