import { StrictMode } from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import React from 'react'
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from "../src/context/CartContext.jsx";


createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId="1096083669179-m736iesqf759ag4b9qhosga52802qbj2.apps.googleusercontent.com">
  <BrowserRouter>

  <CartProvider>
  <App />
</CartProvider>
   </BrowserRouter>

   </GoogleOAuthProvider>

)
