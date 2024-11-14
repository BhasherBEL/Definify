import { toast } from '@zerodevx/svelte-toast';

function alert(title: string, subtitle: string = '', persistant: boolean = false) {
	toast.push(`<strong>${title}</strong><br>${subtitle}`, {
		theme: {
			'--toastBackground': '#ff4d4f',
			'--toastBarBackground': '#d32f2f',
			'--toastColor': '#fff'
		},
		initial: persistant ? 0 : 1,
		next: 0,
		duration: 10000,
		pausable: true
	});
}

function warning(title: string, subtitle: string = '', persistant: boolean = false) {
	toast.push(`<strong>${title}</strong><br>${subtitle}`, {
		theme: {
			'--toastBackground': '#faad14',
			'--toastBarBackground': '#d48806',
			'--toastColor': '#fff'
		},
		initial: persistant ? 0 : 1,
		next: 0,
		duration: 5000,
		pausable: true
	});
}

function success(title: string, subtitle: string = '', persistant: boolean = false) {
	toast.push(`<strong>${title}</strong><br>${subtitle}`, {
		theme: {
			'--toastBackground': '#52c41a',
			'--toastBarBackground': '#389e0d',
			'--toastColor': '#fff'
		},
		initial: persistant ? 0 : 1,
		next: 0,
		duration: 3000,
		pausable: true
	});
}

export default {
	alert,
	warning,
	success
};
