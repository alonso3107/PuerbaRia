import 'zone.js';
import 'zone.js/testing';

/**
 * CONFIGURACIÓN DE PRUEBAS UNITARIAS (TEST SETUP)
 * Este archivo se ejecuta antes de correr las pruebas para configurar mocks del entorno.
 */

// Mock de window.matchMedia para evitar errores en entornos sin soporte (como JSDOM/Node)
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => true,
    }),
  });
}
