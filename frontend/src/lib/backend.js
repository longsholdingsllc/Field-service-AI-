// API base for the ServiceSpeak backend.
//
// The backend now runs on Vercel (servicespeak-api.vercel.app), replacing
// the suspended Render service (servicespeak-api.onrender.com). The URL is
// pinned here so a stale REACT_APP_BACKEND_URL on the hosting project
// cannot point the site back at the dead Render backend.
export const BACKEND_URL = "https://servicespeak-api.vercel.app";

export const API = `${BACKEND_URL}/api`;
