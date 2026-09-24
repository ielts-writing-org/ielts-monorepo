<script lang="ts">
	import { showError } from "$lib/components/error/ErrorModal.svelte";
	import { MessagesSquare, Send } from "@lucide/svelte";
	import { marked } from "marked";
	import { ZodError } from "zod";
	import { ChatApi } from "./chat.api";
	import { getFirstZodError, getGenericError } from "$lib/utils/error";
	import { getPracticeContext } from "$lib/contexts/practice-context.svelte";

	const { task: taskContext, chats: chatHistory, evaluateResponse } = getPracticeContext();

	let chatInput = $state<string>("");
	let response = $state<string>("");
	let isExecuting = $state<boolean>(false);

	const api = new ChatApi();

	async function handleChat() {
		try {
			if (isExecuting) {
				api.abort();
				return;
			}

			const message = chatInput.trim();
			if (!message) {
				return;
			}

			isExecuting = true;

			const stream = await api.chat({
				taskContext,
				evaluateResponse,
				messages: [...chatHistory, { role: "user" as const, content: message }]
			});

			chatHistory.push({ role: "user", content: message });
			chatInput = "";
			response = "";

			const reader = stream.getReader();
			while (true) {
				const { done, value } = await reader.read();
				if (done) {
					break;
				}
				response += value;
			}

			if (response) {
				chatHistory.push({ role: "assistant", content: response });
			}
		} catch (e) {
			if (e instanceof ZodError) {
				showError(getFirstZodError(e));
			} else {
				showError(getGenericError(e, "Unable to chat"));
			}
		} finally {
			isExecuting = false;
		}
	}
</script>

<div class={["h-full w-full rounded-box", isExecuting && "aura aura-holo"]}>
	<div class="flex h-full w-full flex-col gap-2 rounded-box bg-base-100 p-3">
		<div
			class="prose prose-sm flex max-w-none flex-1 flex-col gap-2 overflow-y-auto prose-p:my-0 prose-p:py-0">
			{#if chatHistory.length === 0}
				<div class="flex flex-1 flex-col items-center justify-center gap-2 text-base-content/75">
					<MessagesSquare size="2em" />
					No chats yet.
				</div>
			{:else}
				{#each chatHistory as chat, i (i)}
					<div
						class={[
							"chat",
							chat.role === "assistant" && "chat-start",
							chat.role === "user" && "chat-end"
						]}>
						<div class="chat-header">{chat.role === "user" ? "You" : "AI Tutor"}</div>
						<div class={["chat-bubble", { "chat-bubble-primary": chat.role === "user" }]}>
							{@html marked.parse(chat.content)}
						</div>
					</div>
				{/each}
			{/if}
			{#if isExecuting && response}
				<div class="chat-start chat">
					<div class="chat-header">Assistant</div>
					<div class="chat-bubble">{@html marked.parse(response)}</div>
				</div>
			{/if}
		</div>

		<form class="join" onsubmit={(e) => e.preventDefault()}>
			<label class="input join-item flex-1">
				<input
					type="text"
					placeholder="Ask a question..."
					required={!isExecuting}
					disabled={isExecuting}
					bind:value={chatInput} />
			</label>
			<button class="btn join-item btn-primary" disabled={isExecuting} onclick={handleChat}>
				<span class="loading loading-sm loading-dots" hidden={!isExecuting}></span>
				<span class="hidden sm:inline" hidden={isExecuting}>Send</span>
				<Send class={[isExecuting && "hidden"]} size="1em" />
			</button>
		</form>
	</div>
</div>
