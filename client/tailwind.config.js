/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          950: '#06070a',
          900: '#0a0d14',
          850: '#0e121c',
          800: '#131826',
          700: '#1c2438',
          600: '#2b3754',
          border: '#1f293d',
          neon: '#00f5ff',
          green: '#00ff88',
          purple: '#b026ff',
          pink: '#ff007f',
          gold: '#ffb703',
        }
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
        tech: ['Rajdhani', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'neon-cyan': '0 0 25px -4px rgba(0, 245, 255, 0.45)',
        'neon-green': '0 0 25px -4px rgba(0, 255, 136, 0.45)',
        'neon-purple': '0 0 25px -4px rgba(176, 38, 255, 0.45)',
        'neon-pink': '0 0 25px -4px rgba(255, 0, 127, 0.45)',
        'cyber-card': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'scanline': 'scanline 8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        }
      }
    },
  },
  plugins: [],
}
