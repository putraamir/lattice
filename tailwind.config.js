
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: {
          primary: '#0a0a0b',
          secondary: '#1B1E25',
          tertiary: '#1b1e25',
        },
        surface: {
          primary: '#1b1e25',
          secondary: '#242529',
          tertiary: '#2a2b30',
        },
        primary: {
          DEFAULT: '#7C67BB',
        },
        accent: {
          DEFAULT: '#1B1E25',
        },
        text: {
          primary: '#ffffff',
          secondary: '#a1a1aa',
          tertiary: '#71717a',
          inverse: '#000000',
        },
        border: {
          primary: '#27272a',
          secondary: '#3f3f46',
          accent: '#7C67BB',
        },

        darkbg: "#0a0a0b",
        secondary: {
          DEFAULT: '#8b5cf6',
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
      },
      fontSize: {

        'display-lg': ['3.5rem', { lineHeight: '1.1', fontWeight: '800' }],
        'display-md': ['3rem', { lineHeight: '1.1', fontWeight: '800' }],
        'display-sm': ['2.5rem', { lineHeight: '1.2', fontWeight: '700' }],
        'headline-lg': ['2rem', { lineHeight: '1.2', fontWeight: '700' }],
        'headline-md': ['1.75rem', { lineHeight: '1.3', fontWeight: '600' }],
        'headline-sm': ['1.5rem', { lineHeight: '1.3', fontWeight: '600' }],
        'title-lg': ['1.25rem', { lineHeight: '1.4', fontWeight: '600' }],
        'title-md': ['1.125rem', { lineHeight: '1.4', fontWeight: '500' }],
        'title-sm': ['1rem', { lineHeight: '1.4', fontWeight: '500' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body-md': ['1rem', { lineHeight: '1.5', fontWeight: '400' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
        'label-lg': ['0.875rem', { lineHeight: '1.4', fontWeight: '500' }],
        'label-md': ['0.75rem', { lineHeight: '1.4', fontWeight: '500' }],
        'label-sm': ['0.6875rem', { lineHeight: '1.4', fontWeight: '500' }],
      },
      boxShadow: {
        'glow': '0 0 20px rgba(59, 130, 246, 0.3)',
        'glow-lg': '0 0 40px rgba(59, 130, 246, 0.4)',
        'surface': '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.2)',
        'surface-lg': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
        'surface-xl': '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
      },
    },
  },
  plugins: [],
}

