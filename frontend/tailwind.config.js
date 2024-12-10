/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
  	extend: {
		backgroundImage: {
			'raffle': "url('./src/assets/sss.png')",
		  },
		keyframes: {
		'slide-right': {
			'0%': { transform: 'translateX(-100%)' },
			'100%': { transform: 'translateX(0)' },
		},
		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}

