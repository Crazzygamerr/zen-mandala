<script>
	let routes = [
		{ name: 'Sample 1', path: '/sample1' },
		{ name: 'Sample 2', path: '/sample2' },
		{ name: 'Sample 3', path: '/sample3' }
	];
</script>

<h1>Welcome to Zen-Mandala!</h1>
<p>This website is currently under development, find the samples listed below:</p>

<ul>
	{#each routes as route}
		<li><a href={route.path}>{route.name}</a></li>
	{/each}
</ul>
