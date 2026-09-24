<script lang="ts">
	import { showError } from "$lib/components/error/ErrorModal.svelte";
	import { getPracticeContext } from "$lib/contexts/practice-context.svelte";
	import { getFirstZodError } from "$lib/utils/error";
	import { ListChecks } from "@lucide/svelte";
	import JSONParser from "@streamparser/json/jsonparser.js";
	import type { EvaluateCriterion, EvaluateResponse } from "ielts-server/schemas/evaluate-response";
	import { ZodError } from "zod";
	import { isCriteriaKey } from "./criteria.utils";
	import { EvaluationApi } from "./evaluation.api";
	import type { TaskContext } from "ielts-server/schemas/task-context";
	import {
		EvaluateRequestSchema,
		type EvaluateRequest
	} from "ielts-server/schemas/evaluate-request";

	const context = getPracticeContext();

	let isExecuting = $state(false);

	const criteriaMap = {
		coherence_and_cohesion: "Coherence and Cohesion",
		grammatical_range_and_accuracy: "Grammatical Range and Accuracy",
		lexical_resource: "Lexical Resource",
		task_response: "Task Response"
	} as const satisfies Record<keyof EvaluateResponse["criteria"], string>;

	const emptyCriterion = {
		band: null,
		checks: [],
		problems: [],
		why_this_band: "",
		why_not_next_band: undefined
	} satisfies EvaluateCriterion;

	const api = new EvaluationApi();
	async function handleEvaluate() {
		try {
			api.abort();

			const request = mapToEvaluateRequest(context.task);
			const vRequest = EvaluateRequestSchema.parse(request);

			isExecuting = true;
			context.evaluateResponse = {
				criteria: {
					coherence_and_cohesion: { ...emptyCriterion },
					grammatical_range_and_accuracy: { ...emptyCriterion },
					lexical_resource: { ...emptyCriterion },
					task_response: { ...emptyCriterion }
				},
				overall_band: null
			};

			const stream = await api.evaluate(vRequest);

			const parser = new JSONParser({ paths: ["$", "$.*", "$.criteria.*"] });
			parser.onValue = ({ key, stack, value }) => {
				if (!context.evaluateResponse || !value) {
					return;
				}

				if (stack.length === 1 && key === "overall_band") {
					context.evaluateResponse.overall_band = value as EvaluateResponse["overall_band"];
				} else if (stack.length === 2 && stack[1]?.key === "criteria" && isCriteriaKey(key)) {
					context.evaluateResponse.criteria[key] = value as EvaluateCriterion;
				}
			};

			const reader = stream.getReader();
			while (true) {
				const { done, value } = await reader.read();
				if (done) {
					break;
				}
				parser.write(value);
			}
		} catch (e) {
			if (e instanceof ZodError) {
				showError(getFirstZodError(e));
			} else {
				showError({ title: "Unable to evaluate", message: String(e) });
			}

			context.evaluateResponse = undefined;
		} finally {
			isExecuting = false;
		}
	}

	function mapToEvaluateRequest(context: TaskContext): EvaluateRequest {
		if (context.id === "1") {
			if (!context.image) {
				throw new Error("Task 1 requires an image before submitting for evaluation.");
			}
			return { id: "1", prompt: context.prompt, response: context.response, image: context.image };
		}

		return { id: "2", prompt: context.prompt, response: context.response };
	}
</script>

<div class={["h-full w-full rounded-box", isExecuting && "aura aura-holo"]}>
	<div class="flex h-full w-full flex-col gap-2 rounded-box bg-base-100 p-3">
		<div class="flex flex-1 flex-col gap-2 overflow-y-auto">
			{#if context.evaluateResponse === undefined}
				<div class="flex flex-1 flex-col items-center justify-center gap-2 text-base-content/75">
					<ListChecks size="2em" />
					No evaluations yet.
				</div>
			{:else}
				{#each Object.entries(context.evaluateResponse.criteria) as [criterion, evaluation] (criterion)}
					<details class="collapse-arrow collapse bg-base-100">
						<summary class="collapse-title cursor-pointer p-0 font-semibold">
							<div>
								{criteriaMap[criterion as keyof EvaluateResponse["criteria"]] || criterion}
							</div>
							{#if evaluation.band}
								{const band = $state(evaluation.band)}
								<div
									class={[
										band! >= 7.5 && "text-success",
										band! >= 6.5 && evaluation.band! < 7.5 && "text-warning",
										band! < 6.5 && "text-error"
									]}>
									Band {band.toPrecision(2)}
								</div>
							{:else if isExecuting}
								<div class="animate-pulse text-base-content/75">Analyzing…</div>
							{/if}
						</summary>
						{#if evaluation.why_this_band}
							{const checks = $state(evaluation.checks)}
							{const problems = $state(evaluation.problems)}

							<div class="collapse-content text-sm">
								<p class="text-base-content/75">{evaluation.why_this_band}</p>
								<p class="indent-2 text-base-content/75">
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
														<span>{check.name}</span>
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
													<div class="collapse-content p-0 indent-2 text-base-content/75">
														{check.why}
													</div>
												</details>
											</li>
										{/each}
									</ul>
								{/if}

								{#if problems && problems.length > 0}
									<p class="mt-2 font-semibold text-base-content/75">Problems:</p>
									<ul class="list pl-6">
										{#each problems as problem (problem.description)}
											<li class="list-decimal py-1">
												<details class="collapse">
													<summary
														class="collapse-title flex cursor-pointer flex-col justify-between p-0 sm:flex-row">
														{problem.description}
													</summary>
													<div class="collapse-content text-base-content/75">
														{problem.advice}
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
			{#if context.evaluateResponse}
				{const band = $state(context.evaluateResponse.overall_band)}
				{#if band}
					<div
						class={[
							"badge",
							band >= 7.5 && "badge-success",
							band >= 6.5 && band < 7.5 && "badge-warning",
							band < 6.5 && "badge-error"
						]}>
						Est. Band {band.toPrecision(2)}
					</div>
				{:else if isExecuting}
					<div class="badge animate-pulse badge-ghost">Estimating...</div>
				{/if}
			{/if}
		</div>
	</div>
</div>
