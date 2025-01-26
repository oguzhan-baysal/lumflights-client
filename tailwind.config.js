module.exports = {
  // ... diğer konfigürasyonlar
  theme: {
    extend: {
      keyframes: {
        blob: {
          '0%': {
            transform: 'translate(-50%, -50%) scale(1)',
          },
          '33%': {
            transform: 'translate(-50%, -50%) scale(1.1) translate(20px, -30px)',
          },
          '66%': {
            transform: 'translate(-50%, -50%) scale(0.9) translate(-20px, 30px)',
          },
          '100%': {
            transform: 'translate(-50%, -50%) scale(1)',
          },
        },
      },
      animation: {
        blob: 'blob 10s ease-in-out infinite',
      },
    },
  },
} 