import { redirect } from '@sveltejs/kit';

export function isRedirectPathValid(path: string, origin: string): boolean {
	try {
		const url = new URL(path, origin);
		return url.origin == origin;
	} catch (e) {
		return false;
	}
}

export function safeRedirect(path: string | null | undefined, origin: string) {
	if (!path || !isRedirectPathValid(path, origin)) return redirect(302, '/');
	return redirect(302, path);
}

export function safeRedirectAuto(url: URL) {
	return safeRedirect(url.searchParams.get('redirect'), url.origin);
}
