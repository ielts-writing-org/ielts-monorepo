<script lang="ts">
	import type { Task2EvaluationResponse } from '@ielts/shared/schemas';
	import { Send } from '@lucide/svelte';
	import { getTaskContext } from '../_contexts/task-context';
	import { setChatContext, type ChatContext } from '../_contexts/chat-context';
	import { getHandlerContext } from '../_contexts/handler-context';

	const criteriaMap = {
		task_response: 'Task Response',
		coherence_and_cohesion: 'Coherence and Cohesion',
		lexical_resource: 'Lexical Resource',
		grammatical_range_and_accuracy: 'Grammatical Range and Accuracy'
	} as const satisfies Record<keyof Task2EvaluationResponse['criteria'], string>;

	const taskContext = getTaskContext();

	const INITIAL_CHAT_CONTEXT: ChatContext = [
		{
			role: 'user',
			type: 'context',
			context: {
				topic: taskContext.task_2.topic,
				response_text: taskContext.task_2.response
			}
		}
	];
	const chatContext = $state<ChatContext>(INITIAL_CHAT_CONTEXT);
	setChatContext(chatContext);

	const handlerContext = getHandlerContext();
	handlerContext.task2ChatHandler.onEnd = (isSuccess) => {
		if (isSuccess && handlerContext.task2ChatHandler.result) {
			chatContext.push({
				role: 'assistant',
				type: 'content',
				content: handlerContext.task2ChatHandler.result
			});
		}
	};

	let chatInput = $state<string>('');

	const handleChatSubmit = async () => {
		if (chatInput.trim() === '') return;

		chatContext.push({
			role: 'user',
			type: 'content',
			content: chatInput
		});

		chatInput = '';

		await handlerContext.task2ChatHandler.run(chatContext);
	};
</script>

<aside
	class="sticky top-[10.5%] flex h-[calc(100dvh-6rem)] flex-1 flex-col gap-4 p-2 xl:top-[9.5%]">
	<div class="flex justify-between">
		<div class="flex items-center gap-2">
			<h3 class="text-xl font-semibold">AI Tutor</h3>
		</div>
		{#if handlerContext.task2EvaluationHandler.result}
			{@const overallBand = handlerContext.task2EvaluationHandler.result.overall_band}
			{#if overallBand}
				<p class="badge badge-info">Est. Band {overallBand.toPrecision(2)}</p>
			{:else}
				<p class="badge animate-pulse badge-info">Estimating...</p>
			{/if}
		{/if}
	</div>

	<div
		class="flex flex-1 flex-col gap-2 overflow-y-auto rounded-md border border-base-300 bg-base-100 p-3">
		{#if handlerContext.task2EvaluationHandler.result === undefined}
			<p class="text-base-content/75">No evaluations yet.</p>
		{:else}
			{#each Object.entries(handlerContext.task2EvaluationHandler.result.criteria) as [criterion, evaluation] (criterion)}
				<details class="collapse-arrow collapse bg-base-100">
					<summary class="collapse-title cursor-pointer p-0 font-semibold">
						<p>
							{criteriaMap[criterion as keyof Task2EvaluationResponse['criteria']] || criterion}
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
															'badge badge-sm',
															{
																'badge-success': check.status === 'met',
																'badge-warning': check.status === 'partially_met',
																'badge-error': check.status === 'not_met',
																'badge-ghost': check.status === 'not_applicable'
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

	<div
		class="flex max-h-[50dvh] flex-2 flex-col gap-2 overflow-y-auto rounded-md border border-base-300 bg-base-100 p-3 text-sm">
		{#if chatContext.length <= 1}
			<p class="text-base-content/75">No chats yet.</p>
		{:else}
			{#each chatContext as chat, index (index)}
				{#if chat.type === 'content'}
					<div
						class="chat"
						class:chat-start={chat.role === 'assistant'}
						class:chat-end={chat.role === 'user'}>
						<p class="chat-header">{chat.role === 'user' ? 'You' : 'AI Tutor'}</p>
						<p class="chat-bubble" class:chat-bubble-primary={chat.role === 'user'}>
							{chat.content}
						</p>
					</div>
				{/if}
			{/each}
		{/if}
		{#if handlerContext.task2ChatHandler.result && handlerContext.task2ChatHandler.isRunning}
			<div class="chat-start chat">
				<p class="chat-header">AI Tutor</p>
				<p class="chat-bubble">{handlerContext.task2ChatHandler.result}</p>
			</div>
		{/if}
	</div>

	<form class="join">
		<label class="input join-item flex-1">
			<input
				type="email"
				placeholder="Ask a question about your essay..."
				required
				bind:value={chatInput} />
		</label>
		<button
			class="btn join-item btn-primary"
			type="submit"
			disabled={handlerContext.task2ChatHandler.isRunning}
			onclick={handleChatSubmit}>
			Send
			<Send size="1em" />
		</button>
	</form>
</aside>
