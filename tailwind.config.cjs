module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue,svg}'],
	safelist:[{
		pattern: /w-([1-9]|10|11|12$)\/12/
	}],
	theme: {
		screens: {
			'xs': '376px',
			'sm': '480px',
			'md': '768px',
			'lg': '976px',
			'xl': '1440px',
		},
		extend: {
			keyframes: {
				'in-by-left': {
				  '0%': { transform: 'translateX(-100%)' },
				  '100%': { transform: 'translateX(0)' },
				},
				'fade-in': {
					'0%': { opacity: 0 },
					'100%': { opacity: 1 },
				},
			},
			animation: {
				'in-by-left': 'in-by-left 3s ease-out',
				'fade-in': 'fade-in 2s ease-out'
			},
		},
	},
	plugins: [
		require('@tailwindcss/typography'),
		require("daisyui"),
		require('tailwindcss-patterns')
	],
	darkMode: ['class', '[data-theme="dark"]'],
	daisyui: {
		themes: [
			"emerald",
			{
				dark: {
					...require("daisyui/src/colors/themes")["[data-theme=forest]"],
					// "base-100": "#1e293b", //slate-800
					// "base-content": "#e2e8f0", //slate-200
					"primary":"white",
					"primary-content":"black",
					"--rounded-btn": "0.5rem",
					'h1':{'color':'white'},
					'h2':{'color':'white'},
					// 'h3':{'color':'white'}
				},
			},
			"bumblebee","corporate"
		]
	},
	
}
