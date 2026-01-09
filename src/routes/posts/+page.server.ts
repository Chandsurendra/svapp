// src/routes/posts/+page.server.ts
import { createSessionClient, createSessionDatabaseClient } from '$lib/server/appwrite';
import { redirect, error } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { Query } from 'node-appwrite';
import {
	PUBLIC_APPWRITE_DATABASE_ID,
	PUBLIC_APPWRITE_POSTS_COLLECTION_ID
} from '$env/static/public';

export const load: PageServerLoad = async ({ locals, url, cookies }) => {
	// Check if user is authenticated
	if (!locals.user) {
		redirect(302, '/login');
	}

	try {
		const databases = createSessionDatabaseClient(cookies);

		// Get query parameters for filtering
		const userId = url.searchParams.get('userId');
		const limit = parseInt(url.searchParams.get('limit') || '50');
		const offset = parseInt(url.searchParams.get('offset') || '0');

		// Build query - if userId is provided, filter by it, otherwise get all posts
		const queries = [Query.limit(limit), Query.offset(offset), Query.orderDesc('$createdAt')];
		if (userId) {
			queries.push(Query.equal('userId', userId));
		}

		// Fetch posts from Appwrite
		const posts = await databases.listDocuments(
			PUBLIC_APPWRITE_DATABASE_ID,
			PUBLIC_APPWRITE_POSTS_COLLECTION_ID,
			queries
		);

		return {
			posts: posts.documents,
			total: posts.total,
			user: locals.user
		};
	} catch (err) {
		console.error('Error fetching posts:', err);
		return {
			posts: [],
			total: 0,
			user: locals.user
		};
	}
};

export const actions: Actions = {
	create: async ({ request, locals, cookies }) => {
		// Check if user is authenticated
		if (!locals.user) {
			return error(401, { message: 'Unauthorized' });
		}

		try {
			const databases = createSessionDatabaseClient(cookies);
			const formData = await request.formData();
			const title = formData.get('title');
			const content = formData.get('content');

			// Validate required fields
			if (!title || !content) {
				return {
					error: 'Title and content are required'
				};
			}

			const { ID } = await import('node-appwrite');

			// Create the post
			await databases.createDocument(
				PUBLIC_APPWRITE_DATABASE_ID,
				PUBLIC_APPWRITE_POSTS_COLLECTION_ID,
				ID.unique(),
				{
					title: title.toString(),
					content: content.toString(),
					userId: locals.user.$id
				}
			);

			return {
				success: true
			};
		} catch (err) {
			console.error('Error creating post:', err);
			return {
				error: 'Failed to create post'
			};
		}
	}
};
