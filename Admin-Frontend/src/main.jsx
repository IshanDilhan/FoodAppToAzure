
import { createRoot } from 'react-dom/client'
import React from 'react'
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App/>
  </BrowserRouter>,
)
