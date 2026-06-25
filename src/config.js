const URL = window.location.href.includes('localhost')
    ? 'http://localhost:4040'
    : 'https://whenplantssing.vercel.app/api';

export {URL}