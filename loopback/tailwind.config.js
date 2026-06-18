/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'brand-pink': '#DB76B9',
                'brand-red': '#E46868',
            },
            fontFamily: {
                sans: ['Lexend', 'sans-serif'],
            },
            backgroundImage: {
                'brand-gradient': 'linear-gradient(135deg, #DB76B9 0%, #E46868 100%)',
            },
        },
    },
    plugins: [],
}