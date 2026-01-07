<script lang="ts">
	let { data } = $props();
</script>

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
		<!-- Hero Section -->
		<div class="text-center">
			<h1 class="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
				Welcome to
				<span class="text-blue-600">EduStream</span>
			</h1>
			<p class="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
				Share knowledge, connect with learners, and grow together in a community
				dedicated to education and learning.
			</p>
		</div>

		<!-- Content Section -->
		<div class="mt-16">
			{#if data.user}
				<!-- Authenticated User View -->
				<div class="bg-white rounded-lg shadow-lg p-8">
					<div class="text-center">
						<h2 class="text-2xl font-bold text-gray-900 mb-4">
							Welcome back, {data.user.name || data.user.email}!
						</h2>
						<p class="text-gray-600 mb-8">
							You're all set to start sharing and learning.
						</p>
						<div class="flex flex-col sm:flex-row gap-4 justify-center">
							<a
								href="/posts"
								class="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
							>
								View Posts
							</a>
							<a
								href="/account"
								class="px-6 py-3 bg-white text-gray-700 font-medium border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
							>
								Account Settings
							</a>
						</div>
					</div>
				</div>
			{:else}
				<!-- Unauthenticated User View -->
				<div class="grid md:grid-cols-2 gap-8">
					<div class="bg-white rounded-lg shadow-lg p-8">
						<h2 class="text-2xl font-bold text-gray-900 mb-4">Get Started</h2>
						<p class="text-gray-600 mb-6">
							Join our community of learners and educators. Create an account to
							start sharing your knowledge and learning from others.
						</p>
						<a
							href="/signup"
							class="block w-full text-center px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
						>
							Sign Up
						</a>
					</div>

					<div class="bg-white rounded-lg shadow-lg p-8">
						<h2 class="text-2xl font-bold text-gray-900 mb-4">Already a Member?</h2>
						<p class="text-gray-600 mb-6">
							Sign in to your account to access your posts, connect with others,
							and continue your learning journey.
						</p>
						<a
							href="/login"
							class="block w-full text-center px-6 py-3 bg-white text-gray-700 font-medium border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
						>
							Sign In
						</a>
					</div>
				</div>

				<!-- Features Section -->
				<div class="mt-16">
					<h2 class="text-3xl font-bold text-center text-gray-900 mb-12">
						Why Choose EduStream?
					</h2>
					<div class="grid md:grid-cols-3 gap-8">
						<div class="text-center">
							<div class="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
								<svg
									class="w-8 h-8 text-blue-600"
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
							<h3 class="text-xl font-semibold text-gray-900 mb-2">Share Knowledge</h3>
							<p class="text-gray-600">
								Create and share educational content with a community of learners.
							</p>
						</div>

						<div class="text-center">
							<div class="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
								<svg
									class="w-8 h-8 text-green-600"
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
							<h3 class="text-xl font-semibold text-gray-900 mb-2">Connect</h3>
							<p class="text-gray-600">
								Connect with educators and learners from around the world.
							</p>
						</div>

						<div class="text-center">
							<div class="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
								<svg
									class="w-8 h-8 text-purple-600"
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
							<h3 class="text-xl font-semibold text-gray-900 mb-2">Learn & Grow</h3>
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
