// Configuración del servidor Python
export const SERVER_CONFIG = {
  // 🔧 Cambia esta URL por la de tu servidor Python
  API_BASE_URL: 'http://localhost:8000', // Ejemplo: Flask/FastAPI corriendo en puerto 8000

  // Endpoints disponibles
  ENDPOINTS: {
    SLIDES: '/api/slidesCarrusel',
    // Agrega más endpoints aquí según necesites
    // USERS: '/api/users',
    // SOLICITUDES: '/api/solicitudes'
  },

  // Configuración de timeout para las peticiones (en milisegundos)
  TIMEOUT: 10000, // 10 segundos

  // Headers por defecto
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

// Función helper para construir URLs completas
export function buildApiUrl(endpoint: string): string {
  return `${SERVER_CONFIG.API_BASE_URL}${endpoint}`;
}
