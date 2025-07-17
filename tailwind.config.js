/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'Inter': ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        // Facebook-inspired dark theme colors
        facebook: {
          dark: '#18191A',      // Main background
          card: '#242526',      // Card/surface background
          surface: '#3A3B3C',   // Input/surface elements
          text: '#E4E6EB',      // Primary text
          textSecondary: '#B0B3B8', // Secondary text
          textMuted: '#8E8F91', // Muted text
          border: '#3A3B3C',    // Borders
          hover: '#4E4F50',     // Hover states
        }
      }
    },
  },
  plugins: [],
}