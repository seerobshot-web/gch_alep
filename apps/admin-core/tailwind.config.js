const tailwindPreset = require('@gch/config/tailwind-preset').default;

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [tailwindPreset],
  content: ['./app/**/*.{ts,tsx}'],
  theme: {
    extend: {}
  },
  plugins: []
};
