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
	<div class="flex min-h-screen items-center justify-center bg-gray-50 py-8">
		<div class="text-center">
			<p class="text-gray-600">Loading post...</p>
		</div>
	</div>
{:else}
	<div class="bg-gray-50 py-8">
		<div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
			<!-- Page Header -->
			<div class="mb-6 flex items-center justify-between">
				<a href="/posts" class="text-sm font-medium text-blue-600 hover:text-blue-800">
					← Back to Posts
				</a>
				{#if data?.isOwner}
					<div class="flex gap-3">
						{#if !isEditing}
							<button
								onclick={toggleEdit}
								class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
							>
								Edit
							</button>
							<button
								onclick={() => (showDeleteConfirm = true)}
								class="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
							>
								Delete
							</button>
						{/if}
					</div>
				{/if}
			</div>

			<!-- Error Message -->
			{#if form?.error}
				<div class="mb-4 rounded-md border border-red-200 bg-red-50 p-4 text-red-700">
					{form.error}
				</div>
			{/if}

			<!-- Success Message -->
			{#if form?.success}
				<div class="mb-4 rounded-md border border-green-200 bg-green-50 p-4 text-green-700">
					Post updated successfully!
				</div>
			{/if}

			<!-- Post Content -->
			<div class="rounded-lg bg-white p-8 shadow">
				{#if isEditing && data.isOwner}
					<!-- Edit Form -->
					<form method="POST" action="?/update" use:enhance>
						<div class="mb-6">
							<label for="title" class="mb-2 block text-sm font-medium text-gray-700">
								Title
							</label>
							<input
								type="text"
								id="title"
								name="title"
								bind:value={title}
								required
								class="w-full rounded-md border border-gray-300 px-3 py-2 text-2xl font-semibold shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
							/>
						</div>

						<div class="mb-6">
							<label for="content" class="mb-2 block text-sm font-medium text-gray-700">
								Content
							</label>
							<textarea
								id="content"
								name="content"
								bind:value={content}
								required
								rows="12"
								class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
							></textarea>
						</div>

						<div class="flex justify-end gap-3">
							<button
								type="button"
								onclick={toggleEdit}
								class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
							>
								Cancel
							</button>
							<button
								type="submit"
								class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
							>
								Save Changes
							</button>
						</div>
					</form>
				{:else}
					<!-- View Mode -->
					<h1 class="mb-4 text-3xl font-bold text-gray-900">{data.post.title}</h1>
					<div class="prose mb-6 max-w-none">
						<p class="whitespace-pre-wrap text-gray-700">{data.post.content}</p>
					</div>
					<div class="mt-6 border-t pt-4 text-sm text-gray-500">
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
					class="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black"
					role="dialog"
					aria-modal="true"
					aria-labelledby="delete-title"
					tabindex="-1"
				>
					<button
						type="button"
						class="absolute inset-0 h-full w-full"
						aria-label="Close dialog"
						onclick={() => (showDeleteConfirm = false)}
						onkeydown={(e) => {
							if (e.key === 'Escape') {
								showDeleteConfirm = false;
							}
						}}
					></button>
					<div
						class="relative mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
						role="document"
					>
						<h3 id="delete-title" class="mb-4 text-lg font-semibold text-gray-900">Delete Post</h3>
						<p class="mb-6 text-gray-600">
							Are you sure you want to delete this post? This action cannot be undone.
						</p>
						<div class="flex justify-end gap-3">
							<button
								onclick={() => (showDeleteConfirm = false)}
								class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
							>
								Cancel
							</button>
							<form method="POST" action="?/delete" use:enhance>
								<button
									type="submit"
									class="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
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
