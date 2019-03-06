'use strict';

import '../../node_modules/sass-basis/src/js/basis.js';

import BasisFixedHeader from '../../node_modules/sass-basis-layout/src/js/fixed-header.js';
import BasisStickyHeader from '../../node_modules/sass-basis-layout/src/js/sticky-header.js';

document.addEventListener(
  'DOMContentLoaded',
  () => {
    new BasisFixedHeader();
    new BasisStickyHeader();
  },
  false
)
