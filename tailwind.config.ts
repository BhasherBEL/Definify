import type { Config } from 'tailwindcss';
import colors from 'tailwindcss/colors';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	darkMode: 'selector',
	theme: {
		extend: {
			colors: {
				primary: colors.purple,
				secondary: colors.indigo,
				bg: {
					dark: '#2A303C',
					DEFAULT: colors.purple[50]
				},
				text: {
					dark: colors.white,
					DEFAULT: colors.black
					//dark: colors.red[300],
					//DEFAULT: colors.red[700]
				},
				action: {
					text: {
						dark: colors.purple[400],
						DEFAULT: colors.purple[700]
					},
					zone: {
						dark: colors.purple[600],
						DEFAULT: colors.purple[600],
						text: {
							dark: colors.white,
							DEFAULT: colors.white
						}
					}
				},
				zone: {
					dark: colors.gray[700],
					DEFAULT: colors.white
				}
			},
			keyframes: {
				'spin-frac': {
					'0%, 10%, 40%, 60%, 90%, to': { transform: 'rotate(0deg)' },
					'20%, 30%': { transform: 'rotate(300deg)' },
					'70%, 80%': { transform: 'rotate(-210deg)' }
				}
			},
			animation: {
				'spin-frac': 'spin-frac 5s linear infinite'
			}
		}
	},

	plugins: []
} satisfies Config;
