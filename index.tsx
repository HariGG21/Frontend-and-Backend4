import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Assuming App.js is in the same src directory
import { BrowserRouter } from 'react-router-dom';
import './index.css'; // If you have a global CSS file

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement as HTMLElement); // Explicitly cast to HTMLElement
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
} else {
  console.error("Could not find the 'root' element in the HTML.");
}









