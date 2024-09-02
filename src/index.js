import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// In your index.js or App.js
const suppressedErrors = /(ResizeObserver loop completed with undelivered notifications)/;

const originalConsoleError = console.error;

console.error = (...args) => {
  if (args[0] && typeof args[0] === 'string' && suppressedErrors.test(args[0])) {
    // Prevent error from showing up in the browser console
    return;
  }
  originalConsoleError(...args);
};

const originalWindowError = window.onerror;

window.onerror = function(message, source, lineno, colno, error) {
  if (suppressedErrors.test(message)) {
    // Prevent error from showing up in the browser overlay
    return true;
  }
  if (originalWindowError) {
    return originalWindowError(message, source, lineno, colno, error);
  }
  return false;
};

// Your other React setup code


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
