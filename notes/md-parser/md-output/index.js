const outputStyles = {
  color: 'wheat',
  fontSize: '1.25em',
  overflowY: 'auto',
  overflowWrap: 'break-word',
  flexGrow: 1,
  border: '1px solid white',
  padding: 5,
  width: 0,
};

/** @jsx jsx */
import {jsx} from '@emotion/core';

export default function MdOutput({className: outerClass, children: output}) {
  const outputHtml = {__html: output};
  return <div className={outerClass} css={outputStyles} dangerouslySetInnerHTML={outputHtml} />;
}
