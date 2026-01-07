// src/routes/+page.server.ts
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	// Home page is accessible to everyone
	// Pass user data if available
	return {
		user: locals.user
	};
};
