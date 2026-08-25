<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import * as Alert from '$lib/components/ui/alert/index.js';
	import Logo from '$lib/components/logo.svelte';
	import AlertCircleIcon from '@lucide/svelte/icons/alert-circle';
	import { superForm } from 'sveltekit-superforms';
	import { loginSchema } from './schema';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { untrack } from 'svelte';
	import { resolve } from '$app/paths';

	let { data } = $props();
    const form = superForm(untrack(() => data.form), {
      validators: zod4Client(loginSchema),
    });

  const { form: formData, enhance, message } = form;
</script>

<div class="flex flex-1 flex-col items-center justify-center gap-10">
	<div class="my-12">
		<Logo />
	</div>

	<form method="POST" use:enhance class="w-full max-w-sm">
		<Card.Root>
			<Card.Header>
				<Card.Title>Login to your account</Card.Title>
				<Card.Description>Enter your VR-Chat UUID below to login to your account</Card.Description>
			</Card.Header>
			<Card.Content>
				<div class="flex flex-col gap-6">
					<Form.Field {form} name="uuid">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>UUID</Form.Label>
								<Input {...props} bind:value={$formData.uuid} placeholder="usr_xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" />
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>

					<Form.Field {form} name="password">
						<Form.Control>
							{#snippet children({ props })}
								<div class="flex items-center">
									<Form.Label>Password</Form.Label>
									<a
										href={resolve("/forgot-password")}
										class="ms-auto inline-block text-sm underline-offset-4 hover:underline"
									>
										Forgot your password?
									</a>
								</div>
								<Input {...props} type="password" bind:value={$formData.password} />
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</div>
			</Card.Content>

			<Card.Footer class="flex flex-col gap-6">
				{#if $message}
					<Alert.Root variant="destructive" class="w-full">
						<AlertCircleIcon class="h-4 w-4" />
						<Alert.Title>An error occurred!</Alert.Title>
						<Alert.Description>{$message}</Alert.Description>
					</Alert.Root>
				{/if}

				<Button type="submit" class="w-full">Login</Button>
			</Card.Footer>
		</Card.Root>
	</form>

	<div class="text-xs font-semibold text-muted-foreground">
		Version: {VERSION}
	</div>
</div>
