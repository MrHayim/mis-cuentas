// Pega aquí la URL de tu aplicación web de Apps Script (termina en /exec).
// Es lo único que tienes que cambiar.
window.MC_CONFIG = {
  API_URL: "https://script.google.com/macros/s/AKfycbzBbsaZJ2DpUYGzpUElJBF-jj0xNt3wA3R3AJyYRFQSBxSUxsn8HSAk5dCJ6mmvzF2K/exec"
};
if (!/^https:\/\/script\.google\.com\/.+\/exec$/.test(window.MC_CONFIG.API_URL)) window.MC_CONFIG.API_URL = "";
