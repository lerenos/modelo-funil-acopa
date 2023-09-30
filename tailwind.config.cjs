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
				'in-by-right': {
				  '0%': { transform: 'translateX(100%)' },
				  '100%': { transform: 'translateX(0)' },
				},
				'fade-in': {
					'0%': { opacity: 0 },
					'100%': { opacity: 1 },
				},
				'floating':{
					'0%, 100%': { 
						transform: 'translateY(0)',
					},
					'50%': { 
						transform: 'translateY(-3%)',
					}
				},
				'floating-shadow': {
					'0%, 100%': { 
						transform: 'scale(1)',
						opacity: 1,
						'box-shadow': '0 20px 20px 1px rgba(0,0,0,0.7)'
					},
					'50%': { 
						transform: 'scale(0.8)',
						opacity: 0.5,
						'box-shadow': '0 20px 20px 1px rgba(0,0,0,0.5)' 
					},
				}
			},
			animation: {
				'in-by-left': 'in-by-left 2s ease-out',
				'in-by-right': 'in-by-right 2s ease-out',
				'fade-in': 'fade-in 2s ease-out',
				'floating': 'floating 3s ease-in-out infinite',
				'floating-shadow': 'floating-shadow 3s ease-in-out infinite'
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
			{
				emerald: {
					...require("daisyui/src/colors/themes")["[data-theme=emerald]"],
					'primary':'#22C55E',
					'primary-content':'white'
				},
			},
			{
				dark: {
					...require("daisyui/src/colors/themes")["[data-theme=forest]"],
					// "base-100": "#1e293b", //slate-800
					// "base-content": "#e2e8f0", //slate-200
					"primary":"white",
					"primary-content":"black",
					"--rounded-btn": "0",
					"--rounded-box": "0",
					// 'h1':{'color':'white'},
					// 'h2':{'color':'white'},
					// 'h3':{'color':'white'}
				},
			},
			{
				darkLime: {
					...require("daisyui/src/colors/themes")["[data-theme=forest]"],
					// "base-100": "#1e293b", //slate-800
					"base-content":"white",
					"primary":"#BFFF22",
					"primary-content":"black",
					"--rounded-btn": "0.5",
					"--rounded-box": "0.5",
				},
			},
			{
				darkYellow: {
					...require("daisyui/src/colors/themes")["[data-theme=forest]"],
					// "base-100": "#1e293b", //slate-800
					"base-content":"white",
					"primary":"#FFC820",
					"primary-content":"black",
					"--rounded-btn": "0",
					"--rounded-box": "0",
				},
			},
			{
				bumblebee: {
					...require("daisyui/src/colors/themes")["[data-theme=bumblebee]"],
					'primary':'#FFC820',
					"--rounded-btn": "0",
					"--rounded-box": "0",
				},
			},
			"light",
			"cupcake",
			"corporate",
			"synthwave",
			"retro",
			"cyberpunk",
			"valentine",
			"halloween",
			"garden",
			"forest",
			"aqua",
			"lofi",
			"pastel",
			"fantasy",
			"wireframe",
			"black",
			"luxury",
			"dracula",
			"cmyk",
			"autumn",
			"business",
			"acid",
			"lemonade",
			"night",
			"coffee",
			"winter"
		]
	},
	
}
