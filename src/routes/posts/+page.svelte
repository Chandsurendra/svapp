<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import TiptapEditor from '$lib/components/TiptapEditor.svelte';

	let { data, form } = $props();

	let showCreateForm = $state(false);
	let title = $state('');
	let content = $state('');

	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function toggleCreateForm() {
		showCreateForm = !showCreateForm;
		if (!showCreateForm) {
			title = '';
			content = '';
		}
	}

	// Reset form after successful creation
	$effect(() => {
		if (form?.success) {
			showCreateForm = false;
			title = '';
			content = '';
		}
	});
</script>

<div class="bg-gray-50 py-8">
	<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
		<!-- Page Header -->
		<div class="mb-8 flex justify-between items-center">
			<div>
				<h1 class="text-3xl font-bold text-gray-900">Posts</h1>
				<p class="mt-2 text-sm text-gray-600">
					Total posts: {data.total}
				</p>
			</div>
			<button
				onclick={toggleCreateForm}
				class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
			>
				{showCreateForm ? 'Cancel' : 'Create Post'}
			</button>
		</div>

		<!-- Create Post Form -->
		{#if showCreateForm}
			<div class="mb-8 bg-white rounded-lg shadow p-6">
				<h2 class="text-xl font-semibold mb-4">Create New Post</h2>
				<form method="POST" action="?/create" use:enhance>
					{#if form?.error}
						<div class="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
							{form.error}
						</div>
					{/if}

					<div class="mb-4">
						<label for="title" class="block text-sm font-medium text-gray-700 mb-2">
							Title
						</label>
						<input
							type="text"
							id="title"
							name="title"
							bind:value={title}
							required
							class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
							placeholder="Enter post title"
						/>
					</div>

					<div class="mb-4">
						<label for="content" class="block text-sm font-medium text-gray-700 mb-2">
							Content
						</label>
						<TiptapEditor content={content} onUpdate={(newContent) => content = newContent} />
						<input type="hidden" name="content" value={content} />
					</div>

					<div class="flex justify-end gap-3">
						<button
							type="button"
							onclick={toggleCreateForm}
							class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
						>
							Cancel
						</button>
						<button
							type="submit"
							class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
						>
							Create Post
						</button>
					</div>
				</form>
			</div>
		{/if}

		<!-- Success Message -->
		{#if form?.success}
			<div class="mb-4 p-4 bg-green-50 border border-green-200 rounded-md text-green-700">
				Post created successfully!
			</div>
		{/if}

		<!-- Posts List -->
		{#if data.posts.length === 0}
			<div class="bg-white rounded-lg shadow p-12 text-center">
				<p class="text-gray-500 text-lg">No posts yet. Create your first post!</p>
			</div>
		{:else}
			<div class="space-y-6">
				{#each data.posts as post}
					<a
						href="/posts/{post.$id}"
						class="block bg-white rounded-lg shadow hover:shadow-md transition-shadow"
					>
						<div class="p-6">
							<div class="flex justify-between items-start mb-3">
								<h2 class="text-2xl font-semibold text-gray-900">{post.title}</h2>
								{#if post.userId === data.user.$id}
									<span
										class="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded"
									>
										Your Post
									</span>
								{/if}
							</div>
							<p class="text-gray-700 mb-4 line-clamp-3">{post.content}</p>
							<div class="flex justify-between items-center text-sm text-gray-500">
								<span>Created: {formatDate(post.$createdAt)}</span>
								{#if post.$updatedAt !== post.$createdAt}
									<span>Updated: {formatDate(post.$updatedAt)}</span>
								{/if}
							</div>
						</div>
					</a>
				{/each}
			</div>
		{/if}
	</div>
</div>
