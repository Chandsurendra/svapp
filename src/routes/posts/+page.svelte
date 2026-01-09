<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';

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
	<div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
		<!-- Page Header -->
		<div class="mb-8 flex items-center justify-between">
			<div>
				<h1 class="text-3xl font-bold text-gray-900">Posts</h1>
				<p class="mt-2 text-sm text-gray-600">
					Total posts: {data.total}
				</p>
			</div>
			<button
				onclick={toggleCreateForm}
				class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
			>
				{showCreateForm ? 'Cancel' : 'Create Post'}
			</button>
		</div>

		<!-- Create Post Form -->
		{#if showCreateForm}
			<div class="mb-8 rounded-lg bg-white p-6 shadow">
				<h2 class="mb-4 text-xl font-semibold">Create New Post</h2>
				<form method="POST" action="?/create" use:enhance>
					{#if form?.error}
						<div class="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
							{form.error}
						</div>
					{/if}

					<div class="mb-4">
						<label for="title" class="mb-2 block text-sm font-medium text-gray-700"> Title </label>
						<input
							type="text"
							id="title"
							name="title"
							bind:value={title}
							required
							class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
							placeholder="Enter post title"
						/>
					</div>

					<div class="mb-4">
						<label for="content" class="mb-2 block text-sm font-medium text-gray-700">
							Content
						</label>
						<textarea
							id="content"
							name="content"
							bind:value={content}
							required
							rows="6"
							class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
							placeholder="Enter post content"
						></textarea>
					</div>

					<div class="flex justify-end gap-3">
						<button
							type="button"
							onclick={toggleCreateForm}
							class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
						>
							Cancel
						</button>
						<button
							type="submit"
							class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
						>
							Create Post
						</button>
					</div>
				</form>
			</div>
		{/if}

		<!-- Success Message -->
		{#if form?.success}
			<div class="mb-4 rounded-md border border-green-200 bg-green-50 p-4 text-green-700">
				Post created successfully!
			</div>
		{/if}

		<!-- Posts List -->
		{#if data.posts.length === 0}
			<div class="rounded-lg bg-white p-12 text-center shadow">
				<p class="text-lg text-gray-500">No posts yet. Create your first post!</p>
			</div>
		{:else}
			<div class="space-y-6">
				{#each data.posts as post}
					<a
						href="/posts/{post.$id}"
						class="block rounded-lg bg-white shadow transition-shadow hover:shadow-md"
					>
						<div class="p-6">
							<div class="mb-3 flex items-start justify-between">
								<h2 class="text-2xl font-semibold text-gray-900">{post.title}</h2>
								{#if post.userId === data.user.$id}
									<span class="rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
										Your Post
									</span>
								{/if}
							</div>
							<p class="mb-4 line-clamp-3 text-gray-700">{post.content}</p>
							<div class="flex items-center justify-between text-sm text-gray-500">
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
