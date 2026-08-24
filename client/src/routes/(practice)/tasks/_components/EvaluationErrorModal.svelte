<script lang="ts">
	type EvaluationErrorModalProps = {
		errorMessage: string | undefined;
		modal: HTMLDialogElement | undefined;
	};

	let {
		errorMessage,
		modal = $bindable<HTMLDialogElement | undefined>()
	}: EvaluationErrorModalProps = $props();
</script>

<dialog class="modal" bind:this={modal}>
	<div class="modal-box">
		<h3 class="text-lg font-bold">Error during evaluation</h3>
		<p class="py-4">{errorMessage ?? 'There was an error during the evaluation process.'}</p>
		<div class="modal-action">
			<form method="dialog">
				<button class="btn">Close</button>
			</form>
		</div>
	</div>
</dialog>
