<script lang="ts">
	import { invalidateAll } from "$app/navigation";
	import { resolve } from "$app/paths";
	import { authClient } from "$lib/shared/auth-client.js";

	let { children, data } = $props();

	const handleLogout = async () => {
		await authClient.signOut({
			callbackURL: window.location.origin,
			fetchOptions: {
				onSuccess: async () => {
					await invalidateAll();
				}
			}
		});
	};
</script>

<div class="min-h-screen w-full bg-base-200 text-base-content">
	<header
		class="flex flex-col items-center gap-2 border-b border-base-content/10 bg-base-100 px-4 py-2">
		<div class="flex w-full justify-between">
			<a
				class="flex min-w-29 items-center gap-2"
				href={resolve("/")}
				aria-label="LexisWriting home">
				<span
					class="grid h-9.5 w-9.5 place-items-center rounded-lg bg-primary font-extrabold text-primary-content">
					AI
				</span>
				<div class="flex flex-col">
					<h1 class="text-lg font-bold">LexisWriting</h1>
					<h2 class="text-xs text-base-content/75">IELTS Academic AI Tutor</h2>
				</div>
			</a>

			<div class="ml-auto flex items-center gap-2 sm:gap-3">
				{#if data.session}
					<div class="badge hidden badge-outline badge-sm font-semibold badge-warning sm:inline">
						🔥 5-Day Streak
					</div>
					<div class="badge hidden badge-soft badge-sm font-semibold sm:inline">
						Target: Band 7.5
					</div>

					<div class="text-sm font-semibold">{data.user?.name}</div>
					<div class="avatar">
						<img
							class="w-8 rounded-full ring ring-base-content/20"
							src={data.user?.image}
							alt={data.user?.name} />
					</div>
					<button class="btn btn-soft btn-error btn-sm" onclick={handleLogout}>Logout</button>
				{:else}
					<a href={resolve("/signin")} class="btn btn-primary">Sign in</a>
				{/if}
			</div>
		</div>

		<nav class="flex w-full items-center justify-evenly gap-1 text-sm" aria-label="Main navigation">
			<a
				class="rounded-lg bg-[#eef0ff] px-3 py-1.5 font-semibold text-[#5045e8]"
				href={resolve("/")}>
				Practice
			</a>
			<a class="rounded-lg px-3 py-1.5 font-semibold text-base-content" href={resolve("/")}>
				Progress
			</a>
			<a class="rounded-lg px-3 py-1.5 font-semibold text-base-content" href={resolve("/")}>
				History
			</a>
			<a class="rounded-lg px-3 py-1.5 font-semibold text-base-content" href={resolve("/")}>
				AI Tutor
			</a>
		</nav>
	</header>

	{@render children()}
</div>
