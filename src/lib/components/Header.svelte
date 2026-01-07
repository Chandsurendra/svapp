<script lang="ts">
	import { enhance } from '$app/forms';

	let { user } = $props();
</script>

<header class="bg-white shadow-sm border-b border-gray-200">
	<nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex justify-between items-center h-16">
			<!-- Logo/Brand -->
			<div class="flex items-center">
				<a href="/" class="text-xl font-bold text-gray-900 hover:text-blue-600">
					EduStream
				</a>
			</div>

			<!-- Navigation Links -->
			<div class="flex items-center gap-6">
				{#if user}
					<a
						href="/posts"
						class="text-gray-700 hover:text-blue-600 font-medium transition-colors"
					>
						Posts
					</a>
					<a
						href="/account"
						class="text-gray-700 hover:text-blue-600 font-medium transition-colors"
					>
						Account
					</a>
					<form method="POST" action="/account?/logout" use:enhance>
						<button
							type="submit"
							class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
						>
							Logout
						</button>
					</form>
				{:else}
				<a
				href="/account"
				class="text-gray-700 hover:text-blue-600 font-medium transition-colors"
			>
				Account
			</a>
			<a
						href="/login"
						class="text-gray-700 hover:text-blue-600 font-medium transition-colors"
					>
						Sign In
					</a>
					<a
						href="/signup"
						class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
					>
						Sign Up
					</a>
				{/if}
			</div>
		</div>
	</nav>
</header>
