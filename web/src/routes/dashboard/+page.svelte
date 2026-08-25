<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import Logo from '$lib/components/logo.svelte';

	let { data } = $props();
</script>

<div class="min-h-screen w-full bg-muted/20 p-8">
	<header class="mx-auto mb-8 flex max-w-5xl items-center justify-between">
		<div class="flex items-center gap-4">
			<Logo />
			<div class="mx-2 h-6 w-px bg-border"></div>
			<h1 class="text-lg font-semibold text-muted-foreground">Dashboard</h1>
		</div>

		<div class="flex items-center gap-4">
			<span class="rounded bg-muted px-2 py-1 text-xs text-muted-foreground">
				ID: {data.user.id}
			</span>
			<form action="/api/auth/logout" method="POST">
			    <Button variant="ghost" size="sm" type="submit">Logout</Button>
			</form>
		</div>
	</header>
</div>
