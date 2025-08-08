/**
 * Base API endpoint for the application
 * This can be overridden by environment variables in production
 */
export const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT || 'https://api.theuncproject.com';