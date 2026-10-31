// API base for the ServiceSpeak backend.
//
// REACT_APP_BACKEND_URL (set on the Vercel project) wins when present;
// otherwise fall back to the hosted Render backend so the site never
// calls a dead or "undefined" API. The Render service is
// `servicespeak-api`, deployed from this repo's backend/ directory.
export const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL || "https://servicespeak-api.onrender.com";

export const API = `${BACKEND_URL}/api`;
