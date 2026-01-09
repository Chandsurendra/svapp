// src/routes/posts/+server.ts
import { createSessionClient } from '$lib/server/appwrite';
import { json, error } from '@sveltejs/kit';
import { ID, Query } from 'node-appwrite';
import {
	PUBLIC_APPWRITE_DATABASE_ID,
	PUBLIC_APPWRITE_POSTS_COLLECTION_ID
} from '$env/static/public';

export async function GET(event) {
	try {
		// Check if user is authenticated
		if (!event.locals.user) {
			return error(401, { message: 'Unauthorized' });
		}

		const { databases } = createSessionClient(event);

		// Get query parameters for filtering
		const userId = event.url.searchParams.get('userId');
		const limit = parseInt(event.url.searchParams.get('limit') || '50');
		const offset = parseInt(event.url.searchParams.get('offset') || '0');

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

		return json({
			posts: posts.documents,
			total: posts.total
		});
	} catch (err) {
		console.error('Error fetching posts:', err);
		return error(500, { message: 'Failed to fetch posts' });
	}
}

export async function POST(event) {
	try {
		// Check if user is authenticated
		if (!event.locals.user) {
			return error(401, { message: 'Unauthorized' });
		}

		const { databases } = createSessionClient(event);
		const body = await event.request.json();

		// Validate required fields
		const { title, content } = body;
		if (!title || !content) {
			return error(400, { message: 'Title and content are required' });
		}

		// Create the post
		const post = await databases.createDocument(
			PUBLIC_APPWRITE_DATABASE_ID,
			PUBLIC_APPWRITE_POSTS_COLLECTION_ID,
			ID.unique(),
			{
				title,
				content,
				userId: event.locals.user.$id
			}
		);

		return json(post, { status: 201 });
	} catch (err) {
		console.error('Error creating post:', err);
		return error(500, { message: 'Failed to create post' });
	}
}
