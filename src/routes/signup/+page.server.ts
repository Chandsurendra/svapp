import { SESSION_COOKIE, createAdminClient } from '$lib/server/appwrite.js';
import { redirect } from '@sveltejs/kit';
import { ID, OAuthProvider } from 'node-appwrite';

export const actions = {
	signup: async ({ request, cookies }) => {
		// Extract the form data.
		const form = await request.formData();
		const email = form.get('email');
		const password = form.get('password');
		const name = form.get('name');

		// Create the Appwrite client.
		const { account } = createAdminClient();

		// Create the session using the client
		await account.create({
			userId: ID.unique(),
			email,
			password,
			name
		});
		const session = await account.createEmailPasswordSession({
			email,
			password
		});

		// Set the session cookie with the secret
		cookies.set(SESSION_COOKIE, session.secret, {
			sameSite: 'strict',
			expires: new Date(session.expire),
			secure: true,
			path: '/'
		});

		// Redirect to the account page.
		redirect(302, '/account');
	},
	oauth: async (event) => {
		const { account } = createAdminClient();

		const redirectUrl = await account.createOAuth2Token({
			provider: OAuthProvider.Google,
			success: `${event.url.origin}/oauth`,
			failure: `${event.url.origin}/signup`
		});

		throw redirect(302, redirectUrl);
	}
};
