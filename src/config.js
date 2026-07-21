const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';
const SERVER_URL = 'https://whenplantssing.vercel.app/' || (isLocalhost ? 'http://localhost:4040/api' : '/api');

export { SERVER_URL };