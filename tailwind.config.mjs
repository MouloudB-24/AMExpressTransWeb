/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // 🎨 Couleur principale de la marque (en-têtes, fonds sombres, titres).
        marine: {
          DEFAULT: '#0B2A4A',
          50: '#eef4fa',
          100: '#d3e1ef',
          200: '#a7c3df',
          300: '#6f99c7',
          400: '#3d6ea6',
          500: '#1f4e80',
          600: '#143a63',
          700: '#0B2A4A',
          800: '#081f37',
          900: '#051324',
        },
        // 🎨 Couleur d'accent / boutons d'action (CTA).
        orange: {
          DEFAULT: '#F97316',
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
      },
      fontFamily: {
        // Police Inter chargée en self-hosted via @fontsource (voir BaseLayout.astro).
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        content: '1200px', // largeur maximale du contenu centré
      },
    },
  },
  plugins: [],
};
