<script lang="ts">
	import { errorModal } from "$lib/components/ErrorModal.svelte";
	import type { Task2EvaluationResponse } from "ielts-shared/schemas";
	import { EvaluationHandler } from "./handler.svelte";

	type EvaluationPanelProps = {
		// TODO: Add evaluations if existed
		taskContext: { topic: string; response: string };
	};

	const { taskContext }: EvaluationPanelProps = $props();

	const criteriaMap = {
		task_response: "Task Response",
		coherence_and_cohesion: "Coherence and Cohesion",
		lexical_resource: "Lexical Resource",
		grammatical_range_and_accuracy: "Grammatical Range and Accuracy"
	} as const satisfies Record<keyof Task2EvaluationResponse["criteria"], string>;

	const evaluationHandler = new EvaluationHandler();
	evaluationHandler.onError = (errorMessage) => {
		errorModal?.setErrorMessage(errorMessage);
		errorModal?.showErrorModal();
	};

	const handleEvaluate = async () => {
		await evaluationHandler.execute(taskContext.topic, taskContext.response);
	};
</script>

<div class="flex justify-between">
	<div class="flex items-center gap-2">
		<button
			class="group btn btn-soft btn-primary"
			onclick={handleEvaluate}
			disabled={evaluationHandler.isExecuting}>
			<span class="loading loading-spinner not-group-disabled:hidden"></span>
			Evaluate
		</button>
	</div>
	{#if evaluationHandler.reponse}
		{@const overallBand = evaluationHandler.reponse.overall_band}
		{#if overallBand}
			<p class="badge badge-info">Est. Band {overallBand.toPrecision(2)}</p>
		{:else}
			<p class="badge animate-pulse badge-info">Estimating...</p>
		{/if}
	{/if}
</div>

<div
	class="flex flex-1 flex-col gap-2 overflow-y-auto rounded-md border border-base-content/20 p-3">
	{#if evaluationHandler.reponse === undefined}
		<p class="text-base-content/75">No evaluations yet.</p>
	{:else}
		{#each Object.entries(evaluationHandler.reponse.criteria) as [criterion, evaluation] (criterion)}
			<details class="collapse-arrow collapse bg-base-100">
				<summary class="collapse-title cursor-pointer p-0 font-semibold">
					<p>
						{criteriaMap[criterion as keyof Task2EvaluationResponse["criteria"]] || criterion}
					</p>
					{#if evaluation.band}
						<p
							class:text-green-500={evaluation.band! >= 7.5}
							class:text-yellow-500={evaluation.band! >= 6.5 && evaluation.band! < 7.5}
							class:text-red-500={evaluation.band! < 6.5}>
							Band {evaluation.band.toPrecision(2)}
						</p>
					{:else}
						<p class="animate-pulse text-base-content/75">Analyzing…</p>
					{/if}
				</summary>
				{#if evaluation.why_this_band}
					{@const checks = evaluation.checks}
					{@const problems = evaluation.problems}

					<div class="collapse-content text-sm">
						<p class="text-base-content/75">{evaluation.why_this_band}</p>
						{#if checks && checks.length > 0}
							<p class="mt-2 font-semibold text-base-content/75">Checks:</p>
							<ul class="list pl-6">
								{#each checks as check (check.id)}
									<li class="list-decimal py-1">
										<details class="collapse">
											<summary
												class="collapse-title flex cursor-pointer flex-col justify-between p-0 sm:flex-row">
												<span>{check.id}</span>
												<span
													class={[
														"badge badge-sm",
														{
															"badge-success": check.status === "met",
															"badge-warning": check.status === "partially_met",
															"badge-error": check.status === "not_met",
															"badge-ghost": check.status === "not_applicable"
														}
													]}>
													{check.status}
												</span>
											</summary>
											<div class="collapse-content text-base-content/75">
												<p>
													<span class="font-semibold">Evidence:</span>
													{check.evidence}
												</p>
												<p>
													<span class="font-semibold">Reason:</span>
													{check.why}
												</p>
											</div>
										</details>
									</li>
								{/each}
							</ul>
						{/if}

						{#if problems && problems.length > 0}
							<p class="mt-2 font-semibold text-base-content/75">Problems:</p>
							<ul class="list pl-6">
								{#each problems as problem (problem.what)}
									<li class="list-decimal py-1">
										<details class="collapse">
											<summary
												class="collapse-title flex cursor-pointer flex-col justify-between p-0 sm:flex-row">
												{problem.what}
											</summary>
											<div class="collapse-content text-base-content/75">
												<p>
													<span class="font-semibold">Evidence:</span>
													{problem.evidence}
												</p>
												<p>
													<span class="font-semibold">How to:</span>
													{problem.how_to}
												</p>
											</div>
										</details>
									</li>
								{/each}
							</ul>
						{/if}
					</div>
				{/if}
			</details>
		{/each}
	{/if}
</div>
