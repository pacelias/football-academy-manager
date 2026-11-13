import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ActionEffects from './ActionEffects';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <><App /><ActionEffects /></>
  </React.StrictMode>
);
