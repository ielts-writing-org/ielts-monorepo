<script lang="ts" module>
	type ErrorModalController = {
		setErrorMessage: (message: string) => void;
		showErrorModal: () => void;
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
	let errorMessage = $state<string>("");

	function setErrorMessage(message: string) {
		errorMessage = message;
	}

	function showErrorModal() {
		modal?.showModal();
	}

	onMount(() =>
		register({
			setErrorMessage,
			showErrorModal
		})
	);
</script>

<dialog class="modal" bind:this={modal}>
	<div class="modal-box">
		<h3 class="text-lg font-bold">Error during evaluation</h3>
		<p class="py-4">{errorMessage ?? "There was an error during the process."}</p>
		<div class="modal-action">
			<form method="dialog">
				<button class="btn">Close</button>
			</form>
		</div>
	</div>
</dialog>
