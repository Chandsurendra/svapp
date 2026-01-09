// src/routes/posts/[id]/+page.server.ts
import { createSessionClient, createSessionDatabaseClient } from '$lib/server/appwrite';
import { redirect, error } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import {
	PUBLIC_APPWRITE_DATABASE_ID,
	PUBLIC_APPWRITE_POSTS_COLLECTION_ID
} from '$env/static/public';

export const load: PageServerLoad = async ({ params, locals, cookies }) => {
	// Check if user is authenticated
	if (!locals.user) {
		redirect(302, '/signup');
	}

	try {
		const databases = createSessionDatabaseClient(cookies);
		const postId = params.id;

		if (!postId) {
			error(400, { message: 'Post ID is required' });
		}

		// Fetch the post
		const post = await databases.getDocument(
			PUBLIC_APPWRITE_DATABASE_ID,
			PUBLIC_APPWRITE_POSTS_COLLECTION_ID,
			postId
		);

		return {
			post,
			user: locals.user,
			isOwner: post.userId === locals.user.$id
		};
	} catch (err: any) {
		console.error('Error fetching post:', err);
		console.error('Error details:', JSON.stringify(err, null, 2));

		// Handle session errors
		if (err.message?.includes('No user session')) {
			redirect(302, '/login');
		}

		// Appwrite errors can have code in different places
		const errorCode = err.code || err.response?.code || err.statusCode;
		const errorMessage = err.message || err.response?.message || 'Unknown error';

		if (
			errorCode === 404 ||
			errorMessage.includes('not found') ||
			errorMessage.includes('Document with the requested ID could not be found')
		) {
			error(404, { message: 'Post not found' });
		}

		error(500, { message: `Failed to fetch post: ${errorMessage}` });
	}
};

export const actions: Actions = {
	update: async ({ request, params, locals, cookies }) => {
		// Check if user is authenticated
		if (!locals.user) {
			return error(401, { message: 'Unauthorized' });
		}

		try {
			const databases = createSessionDatabaseClient(cookies);
			const postId = params.id;
			const formData = await request.formData();

			// First, fetch the post to check ownership
			const existingPost = await databases.getDocument(
				PUBLIC_APPWRITE_DATABASE_ID,
				PUBLIC_APPWRITE_POSTS_COLLECTION_ID,
				postId
			);

			// Check if the user owns this post
			if (existingPost.userId !== locals.user.$id) {
				return {
					error: 'You can only update your own posts'
				};
			}

			// Validate required fields
			const title = formData.get('title');
			const content = formData.get('content');
			if (!title || !content) {
				return {
					error: 'Title and content are required'
				};
			}

			// Update the post
			const updatedPost = await databases.updateDocument(
				PUBLIC_APPWRITE_DATABASE_ID,
				PUBLIC_APPWRITE_POSTS_COLLECTION_ID,
				postId,
				{
					title: title.toString(),
					content: content.toString()
				}
			);

			return {
				success: true,
				post: updatedPost
			};
		} catch (err: any) {
			console.error('Error updating post:', err);
			if (err.code === 404) {
				return {
					error: 'Post not found'
				};
			}
			return {
				error: 'Failed to update post'
			};
		}
	},
	delete: async ({ params, locals, cookies }) => {
		// Check if user is authenticated
		if (!locals.user) {
			return error(401, { message: 'Unauthorized' });
		}

		try {
			const databases = createSessionDatabaseClient(cookies);
			const postId = params.id;

			// First, fetch the post to check ownership
			const existingPost = await databases.getDocument(
				PUBLIC_APPWRITE_DATABASE_ID,
				PUBLIC_APPWRITE_POSTS_COLLECTION_ID,
				postId
			);

			// Check if the user owns this post
			if (existingPost.userId !== locals.user.$id) {
				return {
					error: 'You can only delete your own posts'
				};
			}

			// Delete the post
			await databases.deleteDocument(
				PUBLIC_APPWRITE_DATABASE_ID,
				PUBLIC_APPWRITE_POSTS_COLLECTION_ID,
				postId
			);

			// Redirect to posts list after deletion
			redirect(302, '/posts');
		} catch (err: any) {
			console.error('Error deleting post:', err);
			if (err.code === 404) {
				return {
					error: 'Post not found'
				};
			}
			return {
				error: 'Failed to delete post'
			};
		}
	}
};
