<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';

	let { data, form } = $props();

	let isEditing = $state(false);
	let title = $state('');
	let content = $state('');
	let showDeleteConfirm = $state(false);

	// Initialize and update state when data changes
	$effect(() => {
		if (data?.post) {
			if (!isEditing) {
				title = data.post.title || '';
				content = data.post.content || '';
			}
		}
	});

	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function toggleEdit() {
		isEditing = !isEditing;
		if (!isEditing && data?.post) {
			// Reset to original values if canceling
			title = data.post.title || '';
			content = data.post.content || '';
		}
	}

	// Reset edit mode after successful update
	$effect(() => {
		if (form?.success && form.post) {
			isEditing = false;
			// Update local state with new post data
			title = form.post.title || '';
			content = form.post.content || '';
		}
	});
</script>

{#if !data?.post}
	<div class="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
		<div class="text-center">
			<p class="text-gray-600">Loading post...</p>
		</div>
	</div>
{:else}
<div class="bg-gray-50 py-8">
	<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
		<!-- Page Header -->
		<div class="mb-6 flex justify-between items-center">
			<a
				href="/posts"
				class="text-blue-600 hover:text-blue-800 text-sm font-medium"
			>
				← Back to Posts
			</a>
			{#if data?.isOwner}
				<div class="flex gap-3">
					{#if !isEditing}
						<button
							onclick={toggleEdit}
							class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
						>
							Edit
						</button>
						<button
							onclick={() => (showDeleteConfirm = true)}
							class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
						>
							Delete
						</button>
					{/if}
				</div>
			{/if}
		</div>

		<!-- Error Message -->
		{#if form?.error}
			<div class="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
				{form.error}
			</div>
		{/if}

		<!-- Success Message -->
		{#if form?.success}
			<div class="mb-4 p-4 bg-green-50 border border-green-200 rounded-md text-green-700">
				Post updated successfully!
			</div>
		{/if}

		<!-- Post Content -->
		<div class="bg-white rounded-lg shadow p-8">
			{#if isEditing && data.isOwner}
				<!-- Edit Form -->
				<form method="POST" action="?/update" use:enhance>
					<div class="mb-6">
						<label for="title" class="block text-sm font-medium text-gray-700 mb-2">
							Title
						</label>
						<input
							type="text"
							id="title"
							name="title"
							bind:value={title}
							required
							class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-2xl font-semibold"
						/>
					</div>

					<div class="mb-6">
						<label for="content" class="block text-sm font-medium text-gray-700 mb-2">
							Content
						</label>
						<textarea
							id="content"
							name="content"
							bind:value={content}
							required
							rows="12"
							class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
						></textarea>
					</div>

					<div class="flex justify-end gap-3">
						<button
							type="button"
							onclick={toggleEdit}
							class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
						>
							Cancel
						</button>
						<button
							type="submit"
							class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
						>
							Save Changes
						</button>
					</div>
				</form>
			{:else}
				<!-- View Mode -->
				<h1 class="text-3xl font-bold text-gray-900 mb-4">{data.post.title}</h1>
				<div class="prose max-w-none mb-6">
					<p class="text-gray-700 whitespace-pre-wrap">{data.post.content}</p>
				</div>
				<div class="border-t pt-4 mt-6 text-sm text-gray-500">
					<p>Created: {formatDate(data.post.$createdAt)}</p>
					{#if data.post.$updatedAt !== data.post.$createdAt}
						<p class="mt-1">Last updated: {formatDate(data.post.$updatedAt)}</p>
					{/if}
				</div>
			{/if}
		</div>

		<!-- Delete Confirmation Modal -->
		{#if showDeleteConfirm}
			<div
				class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
				role="dialog"
				aria-modal="true"
				aria-labelledby="delete-title"
				tabindex="-1"
			>
				<button
					type="button"
					class="absolute inset-0 w-full h-full"
					aria-label="Close dialog"
					onclick={() => (showDeleteConfirm = false)}
					onkeydown={(e) => {
						if (e.key === 'Escape') {
							showDeleteConfirm = false;
						}
					}}
				></button>
				<div
					class="relative bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4"
					role="document"
				>
					<h3 id="delete-title" class="text-lg font-semibold text-gray-900 mb-4">Delete Post</h3>
					<p class="text-gray-600 mb-6">
						Are you sure you want to delete this post? This action cannot be undone.
					</p>
					<div class="flex justify-end gap-3">
						<button
							onclick={() => (showDeleteConfirm = false)}
							class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
						>
							Cancel
						</button>
						<form method="POST" action="?/delete" use:enhance>
							<button
								type="submit"
								class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
							>
								Delete
							</button>
						</form>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>
{/if}