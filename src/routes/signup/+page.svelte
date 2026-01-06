<!-- src/routes/signup/+page.svelte -->
<form action="?/signup" method="post">
	<input id="email" name="email" placeholder="Email" type="email" />
	<input id="password" name="password" placeholder="Password" type="password" />
	<input id="name" name="name" placeholder="Name" type="text" />
	<button type="submit">Sign up</button>
</form>

<form action="?/oauth" method="post">
	<button type="submit">Sign up with Google</button>
</form>
