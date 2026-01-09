// src/routes/signup/+page.server.ts
import { SESSION_COOKIE, createAdminClient } from '$lib/server/appwrite.js';
import { redirect } from '@sveltejs/kit';
import { ID, OAuthProvider } from 'node-appwrite';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	// If user is already logged in, redirect to home page
	if (locals.user) {
		redirect(302, '/');
	}
};

export const actions: Actions = {
	signup: async ({ request, cookies }) => {
		// Extract the form data
		const formData = await request.formData();
		const email = formData.get('email');
		const password = formData.get('password');
		const name = formData.get('name');

		// Validate required fields
		if (!email || !password || !name) {
			return {
				error: 'All fields are required'
			};
		}

		// Validate password length
		if (password.toString().length < 8) {
			return {
				error: 'Password must be at least 8 characters long'
			};
		}

		try {
			// Create the Appwrite client
			const { account } = createAdminClient();

			// Create the user account
			await account.create({
				userId: ID.unique(),
				email: email.toString(),
				password: password.toString(),
				name: name.toString()
			});

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
			console.error('Signup error:', err);

			// Handle different error types
			const errorMessage = err.message || 'Failed to create account';

			if (errorMessage.includes('already exists') || errorMessage.includes('409')) {
				return {
					error: 'An account with this email already exists. Please sign in instead.'
				};
			}

			if (errorMessage.includes('Invalid email')) {
				return {
					error: 'Please enter a valid email address'
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
			failure: `${event.url.origin}/signup`
		});

		throw redirect(302, redirectUrl);
	}
};
