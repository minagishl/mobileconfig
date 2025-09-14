/**
 * Utility functions for site configuration
 * No environment variables needed - derives URL from request context
 */

export function getSiteUrl(request: Request): string {
	const url = new URL(request.url);
	return `${url.protocol}//${url.host}`;
}

export function getDefaultSiteUrl(): string {
	// Default fallback URL for mobileconfig generation
	return 'https://mobileconfig.pages.dev';
}

export function getMobileConfigUrl(request: Request, profileId: string): string {
	const baseUrl = getSiteUrl(request);
	return `${baseUrl}/api/generate/${profileId}`;
}
