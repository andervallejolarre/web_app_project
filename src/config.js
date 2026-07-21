const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';
const SERVER_URL = isLocalhost ? 'http://localhost:4040/api' : 'https://whenplantssing.vercel.app/api';

export { SERVER_URL };