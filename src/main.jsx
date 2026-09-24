import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Importación única de todos los estilos globales de la aplicación
import './styles/global.css';

/**
 * Punto de entrada de JavaScript/React para montar la aplicación en el DOM.
 * Conecta el componente raíz <App /> al elemento <div id="root"> de index.html.
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
