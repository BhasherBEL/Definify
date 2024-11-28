import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	darkMode: 'selector',
	theme: {
		extend: {
			colors: {
				primary: {
					'50': '#faf5ff',
					'100': '#f3e8ff',
					'200': '#e9d5ff',
					'300': '#d8b4fe',
					'400': '#c084fc',
					'500': '#a855f7',
					'600': '#9333ea',
					'700': '#7e22ce',
					'800': '#6b21a8',
					'900': '#581c87',
					'950': '#1d0432'
				},
				secondary: {
					'50': '#f5f7fa',
					'100': '#e4ebf0',
					'200': '#cbd8e3',
					'300': '#9eb8cd',
					'400': '#6f8db3',
					'500': '#3f639d',
					'600': '#2a4365',
					'700': '#1a365d',
					'800': '#153e75',
					'900': '#1a365d'
				}
			}
		}
	},

	plugins: []
} satisfies Config;
