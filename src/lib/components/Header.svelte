<script lang="ts">
	import { enhance } from '$app/forms';

	let { user } = $props();
</script>

<header class="border-b border-gray-200 bg-white shadow-sm">
	<nav class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="flex h-16 items-center justify-between">
			<!-- Logo/Brand -->
			<div class="flex items-center">
				<a href="/" class="text-xl font-bold text-gray-900 hover:text-blue-600"> EduStream </a>
			</div>

			<!-- Navigation Links -->
			<div class="flex items-center gap-6">
				{#if user}
					<a href="/posts" class="font-medium text-gray-700 transition-colors hover:text-blue-600">
						Posts
					</a>
					<a
						href="/account"
						class="font-medium text-gray-700 transition-colors hover:text-blue-600"
					>
						Account
					</a>
					<form method="POST" action="/account?/logout" use:enhance>
						<button
							type="submit"
							class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
						>
							Logout
						</button>
					</form>
				{:else}
					<a
						href="/account"
						class="font-medium text-gray-700 transition-colors hover:text-blue-600"
					>
						Account
					</a>
					<a href="/login" class="font-medium text-gray-700 transition-colors hover:text-blue-600">
						Sign In
					</a>
					<a
						href="/signup"
						class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
					>
						Sign Up
					</a>
				{/if}
			</div>
		</div>
	</nav>
</header>
