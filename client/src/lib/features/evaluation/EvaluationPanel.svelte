<script lang="ts">
	import { isCriteriaKey } from "$lib/features/evaluation/utils";
	import { errorModal } from "$lib/core/error/ErrorModal.svelte";
	import { ListChecks } from "@lucide/svelte";
	import JSONParser from "@streamparser/json/jsonparser.js";
	import { EventSourceParserStream } from "eventsource-parser/stream";
	import type {
		CriterionEvaluationResponse,
		EvaluationResponse
	} from "ielts-shared/schemas/evaluation-response";
	import { EvaluationApi } from "./api";
	import { ZodError } from "zod";

	type EvaluationPanelProps = {
		taskId: number;
		taskContext: { taskPrompt: string; taskResponse: string };
	};

	const { taskId, taskContext }: EvaluationPanelProps = $props();

	let reponse = $state<EvaluationResponse | undefined>();
	let isExecuting = $state(false);

	const criteriaMap = {
		coherence_and_cohesion: "Coherence and Cohesion",
		grammatical_range_and_accuracy: "Grammatical Range and Accuracy",
		lexical_resource: "Lexical Resource",
		task_response: "Task Response"
	} as const satisfies Record<keyof EvaluationResponse["criteria"], string>;

	const emptyCriterion: CriterionEvaluationResponse = {
		band: null,
		checks: [],
		problems: [],
		why_this_band: "",
		why_not_next_band: null
	};

	let api = new EvaluationApi();
	async function executeEvaluation(task_prompt: string, response_text: string) {
		try {
			api.abort();

			isExecuting = true;
			reponse = {
				criteria: {
					coherence_and_cohesion: { ...emptyCriterion },
					grammatical_range_and_accuracy: { ...emptyCriterion },
					lexical_resource: { ...emptyCriterion },
					task_response: { ...emptyCriterion }
				},
				overall_band: null
			};

			const stream = await api.send({ task_prompt, response_text }, taskId);
			const reader = stream.pipeThrough(new EventSourceParserStream()).getReader();

			const parser = new JSONParser({ paths: ["$", "$.*", "$.criteria.*"] });
			parser.onValue = ({ key, stack, value }) => {
				if (!reponse || !value) return;
				if (stack.length === 1 && key === "overall_band") {
					reponse.overall_band = value as EvaluationResponse["overall_band"];
				} else if (stack.length === 2 && stack[1]?.key === "criteria" && isCriteriaKey(key)) {
					reponse.criteria[key] = value as CriterionEvaluationResponse;
				}
			};

			while (true) {
				const { done, value } = await reader.read();
				if (done || value?.data === "[DONE]") {
					break;
				}
				parser.write(JSON.parse(value.data).choices?.[0]?.delta?.content ?? "");
			}
		} catch (e) {
			if (e instanceof ZodError) {
				console.log(e);
			}

			errorModal?.setErrorMessage(e instanceof Error ? e.message : String(e));
			errorModal?.showErrorModal();
			reponse = undefined;
		} finally {
			isExecuting = false;
		}
	}

	async function handleEvaluate() {
		await executeEvaluation(taskContext.taskPrompt, taskContext.taskResponse);
	}
</script>

<div class="flex h-full flex-col gap-2 p-3">
	<div class="flex flex-1 flex-col gap-2 overflow-y-auto">
		{#if reponse === undefined}
			<div class="flex flex-1 flex-col items-center justify-center gap-2 text-base-content/75">
				<ListChecks size="2em" />
				No evaluations yet.
			</div>
		{:else}
			{#each Object.entries(reponse.criteria) as [criterion, evaluation] (criterion)}
				<details class="collapse-arrow collapse bg-base-100">
					<summary class="collapse-title cursor-pointer p-0 font-semibold">
						<div>
							{criteriaMap[criterion as keyof EvaluationResponse["criteria"]] || criterion}
						</div>
						{#if evaluation.band}
							<div
								class={[
									evaluation.band! >= 7.5 && "text-success",
									evaluation.band! >= 6.5 && evaluation.band! < 7.5 && "text-warning",
									evaluation.band! < 6.5 && "text-error"
								]}>
								Band {evaluation.band.toPrecision(2)}
							</div>
						{:else if isExecuting}
							<div class="animate-pulse text-base-content/75">Analyzing…</div>
						{/if}
					</summary>
					{#if evaluation.why_this_band}
						{@const checks = evaluation.checks}
						{@const problems = evaluation.problems}

						<div class="collapse-content text-sm">
							<p class="text-base-content/75">{evaluation.why_this_band}</p>
							<p class="text-base-content/75">
								<span class="font-semibold">Advice:</span>
								{evaluation.why_not_next_band}
							</p>
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
															check.status === "met" && "badge-success",
															check.status === "partially_met" && "badge-warning",
															check.status === "not_met" && "badge-error"
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
														<span class="font-semibold">Fix:</span>
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

	<div class="flex items-center justify-between">
		<button class="group btn btn-primary" onclick={handleEvaluate} disabled={isExecuting}>
			<span class="loading loading-spinner not-group-disabled:hidden"></span>
			Evaluate
		</button>
		{#if reponse}
			{@const overallBand = reponse.overall_band}
			{#if overallBand}
				<div
					class={[
						"badge",
						overallBand >= 7.5 && "badge-success",
						overallBand >= 6.5 && overallBand < 7.5 && "badge-warning",
						overallBand < 6.5 && "badge-error"
					]}>
					Est. Band {overallBand.toPrecision(2)}
				</div>
			{:else if isExecuting}
				<div class="badge animate-pulse badge-ghost">Estimating...</div>
			{/if}
		{/if}
	</div>
</div>
