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
        brand: {
          navy: '#0F172A',
          dark: '#0B1120',
          card: '#1E293B',
          cyan: '#06B6D4',
          cyanGlow: '#22D3EE',
          green: '#22C55E',
          yellow: '#F59E0B',
          red: '#EF4444',
          purple: '#8B5CF6'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Lexend', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'flash-cyan': 'flashCyan 0.8s ease-in-out infinite alternate',
        'flash-gold': 'flashGold 0.8s ease-in-out infinite alternate',
        'bounce-soft': 'bounceSoft 2s infinite',
        'wave-bar': 'waveBar 1.2s infinite ease-in-out'
      },
      keyframes: {
        flashCyan: {
          '0%': { boxShadow: '0 0 0 0 rgba(6, 182, 212, 0)' },
          '100%': { boxShadow: '0 0 35px 12px rgba(6, 182, 212, 0.8)' }
        },
        flashGold: {
          '0%': { boxShadow: '0 0 0 0 rgba(245, 158, 11, 0)' },
          '100%': { boxShadow: '0 0 35px 12px rgba(245, 158, 11, 0.8)' }
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(-3%)' },
          '50%': { transform: 'translateY(0)' }
        },
        waveBar: {
          '0%, 100%': { height: '8px' },
          '50%': { height: '32px' }
        }
      }
    },
  },
  plugins: [],
}
