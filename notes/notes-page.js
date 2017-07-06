import React from 'react';

import MdParser from './md-parser';
import MdDesc from '../md-desc';

export default function NotesPage() {
  return <notes-parser>
    <header>
      <h1>{'WindNote - Write like the wind!'}</h1>
      <MdDesc />
    </header>

    <MdParser />
  </notes-parser>;
}
