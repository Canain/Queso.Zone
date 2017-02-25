import 'regenerator-runtime/runtime';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import Routes from './routes';

const div = window.document.createElement('div');
window.document.body.appendChild(div);
ReactDOM.render(<Routes/>, div);
