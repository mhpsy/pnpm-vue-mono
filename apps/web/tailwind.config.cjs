/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.html', './src/**/*.vue', './src/**/*.tsx'],
    theme: {
        extend: {
            colors: {
                'ty-main': 'var(--main-color)',
            },
        },
    },
    plugins: [],
};
