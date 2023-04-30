import React from 'react';
import Information from './information';
import reportWebVitals from './reportWebVitals';
import { createRoot } from 'react-dom/client';

createRoot(
  document.getElementById('root')
).render(
  <Information />
);

reportWebVitals();