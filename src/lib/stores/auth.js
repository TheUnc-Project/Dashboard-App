import { writable } from 'svelte/store';
import { browser } from '$app/environment';

function createAuthStore() {
    const { subscribe, set } = writable(false);

    return {
        subscribe,
        set,
        check: () => {
            if (browser) {
                const hasToken = !!localStorage.getItem('auth_token');
                set(hasToken);
                return hasToken;
            }
            return false;
        }
    };
}

export const isAuthenticated = createAuthStore();