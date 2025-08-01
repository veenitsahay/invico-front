import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="291491793496-5rachej73rnmbdptrkmcf855jfvilhlp.apps.googleusercontent.com">
        <BrowserRouter>
          <App />
        </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
