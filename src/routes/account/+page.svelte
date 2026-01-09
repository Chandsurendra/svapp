<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props();

	let isEditingProfile = $state(false);
	let isChangingPassword = $state(false);
	let showPasswordSection = $state(false);

	let name = $state('');
	let email = $state('');
	let phone = $state('');

	let currentPassword = $state('');
	let newPassword = $state('');
	let confirmPassword = $state('');

	// Initialize and update local state when data changes (only when not editing)
	$effect(() => {
		if (data?.user && !isEditingProfile) {
			name = data.user.name || '';
			email = data.user.email || '';
			phone = data.user.phone || '';
		}
	});

	// Reset form states after successful updates
	$effect(() => {
		if (form?.success) {
			isEditingProfile = false;
			isChangingPassword = false;
			currentPassword = '';
			newPassword = '';
			confirmPassword = '';
		}
	});

	function toggleProfileEdit() {
		isEditingProfile = !isEditingProfile;
		if (!isEditingProfile && data?.user) {
			// Reset to original values
			name = data.user.name || '';
			email = data.user.email || '';
			phone = data.user.phone || '';
		}
	}

	function togglePasswordChange() {
		isChangingPassword = !isChangingPassword;
		if (!isChangingPassword) {
			currentPassword = '';
			newPassword = '';
			confirmPassword = '';
		}
	}

	function formatDate(dateString: string) {
		if (!dateString) return 'N/A';
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}
</script>

<div class="bg-gray-50 py-8">
	<div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
		<!-- Page Header -->
		<div class="mb-8">
			<h1 class="text-3xl font-bold text-gray-900">Account Settings</h1>
			<p class="mt-2 text-sm text-gray-600">Manage your account information and preferences</p>
		</div>

		<!-- Success Message -->
		{#if form?.success}
			<div class="mb-6 rounded-md border border-green-200 bg-green-50 p-4 text-green-700">
				{form.message || 'Profile updated successfully!'}
			</div>
		{/if}

		<!-- Error Message -->
		{#if form?.error}
			<div class="mb-6 rounded-md border border-red-200 bg-red-50 p-4 text-red-700">
				{form.error}
			</div>
		{/if}

		<div class="space-y-6">
			<!-- Profile Information Card -->
			<div class="rounded-lg bg-white p-6 shadow">
				<div class="mb-6 flex items-center justify-between">
					<h2 class="text-xl font-semibold text-gray-900">Profile Information</h2>
					{#if !isEditingProfile}
						<button
							onclick={toggleProfileEdit}
							class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
						>
							Edit Profile
						</button>
					{/if}
				</div>

				{#if isEditingProfile}
					<form action="?/updateProfile" method="post" use:enhance class="space-y-6">
						<div>
							<label for="name" class="mb-2 block text-sm font-medium text-gray-700">
								Full Name
							</label>
							<input
								type="text"
								id="name"
								name="name"
								bind:value={name}
								required
								class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
								placeholder="John Doe"
							/>
						</div>

						<div>
							<label for="email" class="mb-2 block text-sm font-medium text-gray-700">
								Email Address
							</label>
							<input
								type="email"
								id="email"
								name="email"
								bind:value={email}
								required
								class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
								placeholder="you@example.com"
							/>
							<p class="mt-1 text-xs text-gray-500">
								Changing your email will require verification
							</p>
						</div>

						<div>
							<label for="phone" class="mb-2 block text-sm font-medium text-gray-700">
								Phone Number
							</label>
							<input
								type="tel"
								id="phone"
								name="phone"
								bind:value={phone}
								class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
								placeholder="+1234567890"
							/>
							<p class="mt-1 text-xs text-gray-500">
								Optional. Adding a phone number will require verification
							</p>
						</div>

						<div class="flex justify-end gap-3">
							<button
								type="button"
								onclick={toggleProfileEdit}
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
					<dl class="space-y-4">
						<div>
							<dt class="text-sm font-medium text-gray-500">Full Name</dt>
							<dd class="mt-1 text-sm text-gray-900">{data?.user?.name || 'Not set'}</dd>
						</div>
						<div>
							<dt class="text-sm font-medium text-gray-500">Email Address</dt>
							<dd class="mt-1 text-sm text-gray-900">{data?.user?.email || 'Not set'}</dd>
						</div>
						<div>
							<dt class="text-sm font-medium text-gray-500">Phone Number</dt>
							<dd class="mt-1 text-sm text-gray-900">{data?.user?.phone || 'Not set'}</dd>
						</div>
						<div>
							<dt class="text-sm font-medium text-gray-500">User ID</dt>
							<dd class="mt-1 font-mono text-sm text-gray-900">{data?.user?.$id}</dd>
						</div>
						<div>
							<dt class="text-sm font-medium text-gray-500">Account Created</dt>
							<dd class="mt-1 text-sm text-gray-900">
								{formatDate(data?.user?.$createdAt)}
							</dd>
						</div>
					</dl>
				{/if}
			</div>

			<!-- Password Change Card -->
			<div class="rounded-lg bg-white p-6 shadow">
				<div class="mb-6 flex items-center justify-between">
					<div>
						<h2 class="text-xl font-semibold text-gray-900">Password</h2>
						<p class="mt-1 text-sm text-gray-500">Change your account password</p>
					</div>
					{#if !isChangingPassword}
						<button
							onclick={togglePasswordChange}
							class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
						>
							Change Password
						</button>
					{/if}
				</div>

				{#if isChangingPassword}
					<form action="?/updatePassword" method="post" use:enhance class="space-y-6">
						<div>
							<label for="currentPassword" class="mb-2 block text-sm font-medium text-gray-700">
								Current Password
							</label>
							<input
								type="password"
								id="currentPassword"
								name="currentPassword"
								bind:value={currentPassword}
								required
								class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
								placeholder="••••••••"
							/>
						</div>

						<div>
							<label for="newPassword" class="mb-2 block text-sm font-medium text-gray-700">
								New Password
							</label>
							<input
								type="password"
								id="newPassword"
								name="newPassword"
								bind:value={newPassword}
								required
								minlength="8"
								class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
								placeholder="••••••••"
							/>
							<p class="mt-1 text-xs text-gray-500">Must be at least 8 characters</p>
						</div>

						<div>
							<label for="confirmPassword" class="mb-2 block text-sm font-medium text-gray-700">
								Confirm New Password
							</label>
							<input
								type="password"
								id="confirmPassword"
								name="confirmPassword"
								bind:value={confirmPassword}
								required
								minlength="8"
								class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
								placeholder="••••••••"
							/>
						</div>

						<div class="flex justify-end gap-3">
							<button
								type="button"
								onclick={togglePasswordChange}
								class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
							>
								Cancel
							</button>
							<button
								type="submit"
								class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
							>
								Update Password
							</button>
						</div>
					</form>
				{:else}
					<p class="text-sm text-gray-600">Your password is hidden for security reasons.</p>
				{/if}
			</div>

			<!-- Account Actions Card -->
			<div class="rounded-lg bg-white p-6 shadow">
				<h2 class="mb-6 text-xl font-semibold text-gray-900">Account Actions</h2>
				<div class="space-y-4">
					<a
						href="/posts"
						class="block rounded-md border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
					>
						View My Posts
					</a>
					<form method="post" action="?/logout" use:enhance>
						<button
							type="submit"
							class="w-full rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
						>
							Logout
						</button>
					</form>
				</div>
			</div>
		</div>
	</div>
</div>
