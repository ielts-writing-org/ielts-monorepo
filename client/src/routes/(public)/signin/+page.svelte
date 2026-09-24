<script lang="ts">
	import { authClient } from "$lib/clients/auth/auth-client";

	const handleSignInWithGitHub = async () => {
		await authClient.signIn.social({
			provider: "github",
			callbackURL: window.location.origin
		});
	};
</script>

<svelte:head>
	<title>Sign in | IELTS Writing</title>
</svelte:head>

<div class="flex min-h-screen w-full items-center justify-center bg-base-300">
	<div class="flex w-full max-w-sm flex-col items-center gap-6 rounded-xl bg-white p-8 shadow-sm">
		<div class="flex flex-col items-center gap-4">
			<span
				class="grid h-10 w-10 place-items-center rounded-lg bg-primary text-sm font-extrabold text-primary-content">
				AI
			</span>
			<div class="text-center">
				<h1 class="text-xl font-bold text-neutral">Welcome to IELTS Writing</h1>
				<p class="text-sm text-neutral">Sign in to continue to your IELTS Academic AI Tutor</p>
			</div>
		</div>

		<button
			type="button"
			class="btn btn-wide btn-outline btn-neutral"
			onclick={handleSignInWithGitHub}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 16 16"
				width="1.25em"
				height="1.25em"
				fill="currentColor"
				aria-hidden="true">
				<path
					d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.07.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.5-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.62.82-2.22-.08-.34-.36-1.12.08-2.34 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.03 2.2-.82 2.2-.82.44 1.22.16 2 .08 2.34.51.6 1.02 1.56.82 2.22 0 3.07-1.87 3.75-3.65 3.94.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .18.13.42.55.35C13.71 14.53 16 11.53 16 8 16 3.58 10.42 0 8 0z">
				</path>
			</svg>
			Continue with GitHub
		</button>
		<p class="text-center text-xs text-neutral/75">
			By signing in, you agree to our Terms of Service and Privacy Policy.
		</p>
	</div>
</div>
