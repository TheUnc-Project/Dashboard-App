/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{html,js,svelte,ts}'],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Public Sans', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
