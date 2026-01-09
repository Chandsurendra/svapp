// src/routes/login/+page.server.ts
import { SESSION_COOKIE, createAdminClient } from '$lib/server/appwrite.js';
import { redirect } from '@sveltejs/kit';
import { OAuthProvider } from 'node-appwrite';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	// If user is already logged in, redirect to home page
	if (locals.user) {
		redirect(302, '/');
	}
};

export const actions: Actions = {
	login: async ({ request, cookies, url }) => {
		// Extract the form data
		const formData = await request.formData();
		const email = formData.get('email');
		const password = formData.get('password');

		// Validate required fields
		if (!email || !password) {
			return {
				error: 'Email and password are required'
			};
		}

		try {
			// Create the Appwrite client
			const { account } = createAdminClient();

			// Create email/password session
			const session = await account.createEmailPasswordSession({
				email: email.toString(),
				password: password.toString()
			});

			// Set the session cookie with the secret
			cookies.set(SESSION_COOKIE, session.secret, {
				sameSite: 'strict',
				expires: new Date(session.expire),
				secure: true,
				path: '/',
				httpOnly: true
			});

			// Redirect to the home page
			redirect(302, '/');
		} catch (err: any) {
			console.error('Login error:', err);

			// Handle different error types
			const errorMessage = err.message || 'Failed to sign in';

			if (errorMessage.includes('Invalid credentials') || errorMessage.includes('401')) {
				return {
					error: 'Invalid email or password'
				};
			}

			if (errorMessage.includes('User not found')) {
				return {
					error: 'No account found with this email address'
				};
			}

			return {
				error: errorMessage
			};
		}
	},
	oauth: async (event) => {
		const { account } = createAdminClient();

		const redirectUrl = await account.createOAuth2Token({
			provider: OAuthProvider.Google,
			success: `${event.url.origin}/oauth`,
			failure: `${event.url.origin}/login`
		});

		throw redirect(302, redirectUrl);
	}
};
