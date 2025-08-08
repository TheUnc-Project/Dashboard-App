import { API_ENDPOINT } from '$lib/meta';
import { goto } from '$app/navigation';
import { browser } from '$app/environment';
import { jwtDecode } from 'jwt-decode';
import { isAuthenticated } from '$lib/stores/auth';

const TOKEN_KEY = 'auth_token';

export async function login(email) {
    try {
        const response = await fetch(`${API_ENDPOINT}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (!data.success) {
            throw new Error(data.message || 'Login failed');
        }

        // Save token to localStorage
        if (browser) {
            localStorage.setItem(TOKEN_KEY, data.access_token);
            localStorage.setItem('user_profile', JSON.stringify(data.profile));
            isAuthenticated.set(true);
        }

        return data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

export function logout() {
    if (browser) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem('user_profile');
        isAuthenticated.set(false);
        goto('/login');
    }
}

export function getToken() {
    if (!browser) return null;
    return localStorage.getItem(TOKEN_KEY);
}

export function handleApiError(error) {
    // If we get a 401 or 403, clear auth state
    if (error.status === 401 || error.status === 403) {
        if (browser) {
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem('user_profile');
            goto('/login');
        }
    }
    throw error;
}

export function getAuthHeaders() {
    const token = getToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
}

export function getUserProfile() {
    if (!browser) return null;
    const profileStr = localStorage.getItem('user_profile');
    try {
        return profileStr ? JSON.parse(profileStr) : null;
    } catch (error) {
        console.error('Error parsing user profile:', error);
        return null;
    }
}