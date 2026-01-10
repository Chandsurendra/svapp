<script lang="ts">
	import { enhance } from '$app/forms';
	import SunIcon from '@lucide/svelte/icons/sun';
	import MoonIcon from '@lucide/svelte/icons/moon';
	import { toggleMode } from 'mode-watcher';
	import { Button } from '$lib/components/ui/button/index.js';
	let { user } = $props();
</script>

<header class="border-b shadow-sm">
	<nav class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="flex h-16 items-center justify-between">
			<!-- Logo/Brand -->
			<div class="flex items-center">
				<a href="/" class=" text-xl font-bold"> EduStream </a>
			</div>

			<!-- Navigation Links -->
			<div class="flex items-center gap-6">
				{#if user}
					<a href="/posts" class="font-medium transition-colors hover:text-blue-600"> Posts </a>
					<a
						href="/account"
						class="font-medium text-gray-700 transition-colors hover:text-blue-600"
					>
						Account
					</a>
					<form method="POST" action="/account?/logout" use:enhance>
						<button
							type="submit"
							class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium transition-colors hover:bg-blue-700"
						>
							Logout
						</button>
					</form>
				{:else}
					<a href="/signin" class="font-medium text-gray-700 transition-colors hover:text-blue-600">
						Sign In
					</a>
					<a
						href="/signup"
						class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium transition-colors hover:bg-blue-700"
					>
						Sign Up
					</a>
				{/if}
				<Button onclick={toggleMode} variant="outline" size="icon">
					<SunIcon
						class="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 !transition-all dark:scale-0 dark:-rotate-90"
					/>
					<MoonIcon
						class="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 !transition-all dark:scale-100 dark:rotate-0"
					/>
					<span class="sr-only">Toggle theme</span>
				</Button>
			</div>
		</div>
	</nav>
</header>
