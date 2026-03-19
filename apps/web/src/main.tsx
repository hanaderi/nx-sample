import { StrictMode } from 'react';
import {sharedTypes} from '@org/shared-types';
import * as ReactDOM from 'react-dom/client';
import App from './app/app';

console.log(sharedTypes)

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
