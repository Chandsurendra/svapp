// src/routes/account/+page.server.ts
import { SESSION_COOKIE, createSessionClient } from '$lib/server/appwrite.js';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	// Logged out users can't access this page.
	if (!locals.user) redirect(302, '/login');

	// Pass the stored user local to the page.
	return {
		user: locals.user
	};
};

export const actions: Actions = {
	updateProfile: async (event) => {
		// Check if user is authenticated
		if (!event.locals.user) {
			return {
				error: 'Unauthorized'
			};
		}

		try {
			const { account } = createSessionClient(event);
			const formData = await event.request.formData();
			const name = formData.get('name');
			const email = formData.get('email');
			const phone = formData.get('phone');

			// Validate required fields
			if (!name || !email) {
				return {
					error: 'Name and email are required'
				};
			}

			// Update name
			if (name.toString() !== event.locals.user.name) {
				await account.updateName({ name: name.toString() });
			}

			// Update email if changed (requires verification in Appwrite)
			let emailUpdated = false;
			if (email.toString() !== event.locals.user.email) {
				try {
					await account.updateEmail({ email: email.toString() });
					emailUpdated = true;
				} catch (err: any) {
					console.error('Email update error:', err);
					return {
						error: 'Failed to update email. Please try again later.'
					};
				}
			}

			// Update phone if provided and changed
			const phoneValue = phone?.toString() || '';
			let phoneUpdated = false;
			if (phoneValue && phoneValue !== (event.locals.user.phone || '')) {
				try {
					await account.updatePhone({ phone: phoneValue });
					phoneUpdated = true;
				} catch (err: any) {
					console.error('Phone update error:', err);
					// Don't fail the whole update if phone update fails
					return {
						success: true,
						message: 'Profile updated, but phone number update failed. You can try again later.'
					};
				}
			}

			// Return appropriate success message
			if (emailUpdated && phoneUpdated) {
				return {
					success: true,
					message: 'Profile updated. Please verify your new email and phone number.'
				};
			} else if (emailUpdated) {
				return {
					success: true,
					message: 'Profile updated. Please check your email to verify the new email address.'
				};
			} else if (phoneUpdated) {
				return {
					success: true,
					message: 'Profile updated. Please verify your phone number.'
				};
			}

			return {
				success: true,
				message: 'Profile updated successfully!'
			};
		} catch (err: any) {
			console.error('Profile update error:', err);
			const errorMessage = err.message || 'Failed to update profile';
			return {
				error: errorMessage
			};
		}
	},
	updatePassword: async (event) => {
		// Check if user is authenticated
		if (!event.locals.user) {
			return {
				error: 'Unauthorized'
			};
		}

		try {
			const { account } = createSessionClient(event);
			const formData = await event.request.formData();
			const currentPassword = formData.get('currentPassword');
			const newPassword = formData.get('newPassword');
			const confirmPassword = formData.get('confirmPassword');

			// Validate required fields
			if (!currentPassword || !newPassword || !confirmPassword) {
				return {
					error: 'All password fields are required'
				};
			}

			// Validate password length
			if (newPassword.toString().length < 8) {
				return {
					error: 'New password must be at least 8 characters long'
				};
			}

			// Validate passwords match
			if (newPassword.toString() !== confirmPassword.toString()) {
				return {
					error: 'New passwords do not match'
				};
			}

			// Update password using Appwrite
			await account.updatePassword({
				password: newPassword.toString(),
				oldPassword: currentPassword.toString()
			});

			return {
				success: true,
				message: 'Password updated successfully!'
			};
		} catch (err: any) {
			console.error('Password update error:', err);
			const errorMessage = err.message || 'Failed to update password';

			if (errorMessage.includes('Invalid credentials') || errorMessage.includes('401')) {
				return {
					error: 'Current password is incorrect'
				};
			}

			return {
				error: errorMessage
			};
		}
	},
	logout: async (event) => {
		// Create the Appwrite client.
		const { account } = createSessionClient(event);

		// Delete the session on Appwrite, and delete the session cookie.
		await account.deleteSession({ sessionId: 'current' });
		event.cookies.delete(SESSION_COOKIE, { path: '/' });

		// Redirect to the login page.
		redirect(302, '/login');
	}
};
