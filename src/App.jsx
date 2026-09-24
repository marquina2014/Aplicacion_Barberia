import React from 'react';
import AppRouter from './routes/AppRouter';

/**
 * Componente: App
 * Propósito: Componente raíz de la aplicación.
 * Orquesta el sistema de enrutamiento y provee la estructura base.
 */
function App() {
  return (
    <div className="app-container">
      {/* Carga del enrutador centralizado de la aplicación */}
      <AppRouter />
    </div>
  );
}

export default App;
