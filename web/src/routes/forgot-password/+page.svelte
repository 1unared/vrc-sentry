<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import Logo from '$lib/components/logo.svelte';
	import HelpCircleIcon from '@lucide/svelte/icons/help-circle';
	import { resolve } from '$app/paths';
</script>

<div class="flex flex-1 flex-col items-center justify-center gap-10">
	<div class="my-12">
		<Logo />
	</div>

	<Card.Root class="w-full max-w-sm">
		<Card.Header class="text-center">
            <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <HelpCircleIcon class="h-6 w-6 text-muted-foreground" />
            </div>
			<Card.Title>Reset Password</Card.Title>
			<Card.Description>
                Account security is managed manually by the administrators.
            </Card.Description>
		</Card.Header>

		<Card.Content class="text-center">
			<div class="flex flex-col gap-4 text-sm text-muted-foreground">
				<p>
					To reset your password or obtain a new invite link, please contact a
					<span class="text-foreground font-medium">Team Member</span>.
				</p>
				<p>
					They will be able to verify your identity and assist you with access.
				</p>
			</div>
		</Card.Content>

		<Card.Footer>
			<a href={resolve("/login")} class="w-full">
				<Button variant="outline" class="w-full">
					Back to Login
				</Button>
			</a>
		</Card.Footer>
	</Card.Root>

	<div class="text-xs font-semibold text-muted-foreground">
		Version: {VERSION}
	</div>
</div>
