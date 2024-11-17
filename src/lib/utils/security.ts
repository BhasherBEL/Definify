import { page } from '$app/stores';
import { get } from 'svelte/store';

export function isRedirectPathValid(path: string, origin: string): boolean {
	try {
		const url = new URL(path, origin);
		return url.origin == origin;
	} catch (e) {
		return false;
	}
}

export function safeRedirect(path: string | null | undefined, origin: string) {
	if (!path || !isRedirectPathValid(path, origin)) return '/';
	return path;
}
