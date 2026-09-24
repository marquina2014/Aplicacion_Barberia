import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Configuración de Vite para la aplicación React.
 * Proporciona soporte para Fast Refresh (HMR) y compilación optimizada.
 */
export default defineConfig({
  plugins: [
    // Habilita el plugin oficial de React para JSX y Fast Refresh
    react()
  ],
  server: {
    // Puerto de desarrollo estándar
    port: 3000,
    // Abre el navegador automáticamente al iniciar si es necesario
    open: false
  }
});
