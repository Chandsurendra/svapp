<script lang="ts">
	let { data } = $props();
</script>

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
	<div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
		<!-- Hero Section -->
		<div class="text-center">
			<h1 class="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
				Welcome to
				<span class="text-blue-600">EduStream</span>
			</h1>
			<p
				class="mx-auto mt-3 max-w-md text-base text-gray-500 sm:text-lg md:mt-5 md:max-w-3xl md:text-xl"
			>
				Share knowledge, connect with learners, and grow together in a community dedicated to
				education and learning.
			</p>
		</div>

		<!-- Content Section -->
		<div class="mt-16">
			{#if data.user}
				<!-- Authenticated User View -->
				<div class="rounded-lg bg-white p-8 shadow-lg">
					<div class="text-center">
						<h2 class="mb-4 text-2xl font-bold text-gray-900">
							Welcome back, {data.user.name || data.user.email}!
						</h2>
						<p class="mb-8 text-gray-600">You're all set to start sharing and learning.</p>
						<div class="flex flex-col justify-center gap-4 sm:flex-row">
							<a
								href="/posts"
								class="rounded-md bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
							>
								View Posts
							</a>
							<a
								href="/account"
								class="rounded-md border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
							>
								Account Settings
							</a>
						</div>
					</div>
				</div>
			{:else}
				<!-- Unauthenticated User View -->
				<div class="grid gap-8 md:grid-cols-2">
					<div class="rounded-lg bg-white p-8 shadow-lg">
						<h2 class="mb-4 text-2xl font-bold text-gray-900">Get Started</h2>
						<p class="mb-6 text-gray-600">
							Join our community of learners and educators. Create an account to start sharing your
							knowledge and learning from others.
						</p>
						<a
							href="/signup"
							class="block w-full rounded-md bg-blue-600 px-6 py-3 text-center font-medium text-white transition-colors hover:bg-blue-700"
						>
							Sign Up
						</a>
					</div>

					<div class="rounded-lg bg-white p-8 shadow-lg">
						<h2 class="mb-4 text-2xl font-bold text-gray-900">Already a Member?</h2>
						<p class="mb-6 text-gray-600">
							Sign in to your account to access your posts, connect with others, and continue your
							learning journey.
						</p>
						<a
							href="/login"
							class="block w-full rounded-md border border-gray-300 bg-white px-6 py-3 text-center font-medium text-gray-700 transition-colors hover:bg-gray-50"
						>
							Sign In
						</a>
					</div>
				</div>

				<!-- Features Section -->
				<div class="mt-16">
					<h2 class="mb-12 text-center text-3xl font-bold text-gray-900">Why Choose EduStream?</h2>
					<div class="grid gap-8 md:grid-cols-3">
						<div class="text-center">
							<div
								class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100"
							>
								<svg
									class="h-8 w-8 text-blue-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
									/>
								</svg>
							</div>
							<h3 class="mb-2 text-xl font-semibold text-gray-900">Share Knowledge</h3>
							<p class="text-gray-600">
								Create and share educational content with a community of learners.
							</p>
						</div>

						<div class="text-center">
							<div
								class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100"
							>
								<svg
									class="h-8 w-8 text-green-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
									/>
								</svg>
							</div>
							<h3 class="mb-2 text-xl font-semibold text-gray-900">Connect</h3>
							<p class="text-gray-600">
								Connect with educators and learners from around the world.
							</p>
						</div>

						<div class="text-center">
							<div
								class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100"
							>
								<svg
									class="h-8 w-8 text-purple-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M13 10V3L4 14h7v7l9-11h-7z"
									/>
								</svg>
							</div>
							<h3 class="mb-2 text-xl font-semibold text-gray-900">Learn & Grow</h3>
							<p class="text-gray-600">
								Access a wealth of educational content and expand your knowledge.
							</p>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>
