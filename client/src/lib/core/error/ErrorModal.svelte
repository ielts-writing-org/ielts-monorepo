<script lang="ts" module>
	type Error = { title: string; message: string };

	type ErrorModalController = {
		showError: (error: Error) => void;
	};

	export let errorModal: ErrorModalController | undefined;

	function register(controller: ErrorModalController) {
		errorModal = controller;

		return () => {
			if (errorModal === controller) {
				errorModal = undefined;
			}
		};
	}
</script>

<script lang="ts">
	import { onMount } from "svelte";

	let modal = $state<HTMLDialogElement>();
	let error = $state<Error>();
	const errorQueue = $state<Array<Error>>([]);

	function showError(error: Error) {
		console.log(error);
		errorQueue.push(error);

		if (modal?.open) {
			return;
		}

		handleOpen();
	}

	function waitForTransition(element: HTMLElement): Promise<void> {
		return new Promise((resolve) => {
			element.addEventListener("transitionend", () => resolve(), {
				once: true
			});
		});
	}

	function handleOpen() {
		const lastMessage = errorQueue.pop();
		if (!lastMessage) {
			return;
		}

		error = lastMessage;
		modal?.showModal();
	}

	async function handleClose(
		e: MouseEvent & {
			currentTarget: EventTarget & HTMLButtonElement;
		}
	) {
		e.preventDefault();
		modal?.requestClose();

		await waitForTransition(modal!);

		handleOpen();
	}

	onMount(() => {
		const unregister = register({
			showError
		});

		if (errorQueue.length) {
			handleOpen();
		}

		return unregister;
	});
</script>

<dialog class="modal" bind:this={modal}>
	<div class="modal-box">
		<h3 class="text-lg font-bold">{error?.title ?? "Error"}</h3>
		<p class="py-4">
			{error?.message ?? "There was an expected error during the process."}
		</p>
		<div class="modal-action">
			<form method="dialog">
				<button class="btn" onclick={handleClose}>Close</button>
			</form>
		</div>
	</div>
</dialog>
