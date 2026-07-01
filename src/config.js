const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';
const SERVER_URL = import.meta.env.VITE_API_URL || (isLocalhost ? 'http://localhost:4040/api' : '/api');

export { SERVER_URL };