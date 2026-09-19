<script lang="ts">
	import { errorModal } from "$lib/core/error/ErrorModal.svelte";
	import { MessagesSquare, Send } from "@lucide/svelte";
	import { EventSourceParserStream } from "eventsource-parser/stream";
	import { marked } from "marked";
	import { ChatApi } from "./api";
	import type { ChatRequest } from "ielts-shared/schemas/chat-request";

	type ChatPanelProps = {
		// TODO: Add evaluations if existed
		taskId: number;
		taskContext: { taskPrompt: string; taskResponse: string };
	};
	const { taskId, taskContext }: ChatPanelProps = $props();

	let chatInput = $state<string>("");
	let isExecuting = $state(false);
	let response = $state<string | undefined>();

	const api = new ChatApi();

	type ChatContext = {
		taskPrompt: string;
		taskResponse: string;
	};

	type ChatHistory = Array<{
		role: "user" | "assistant";
		content: string;
	}>;

	async function executeChat(chatContext: ChatRequest) {
		try {
			api.abort();

			isExecuting = true;
			response = undefined;

			const stream = await api.send(chatContext);
			const reader = stream.pipeThrough(new EventSourceParserStream()).getReader();

			response = "";
			while (true) {
				const { done, value } = await reader.read();
				if (done || value?.data === "[DONE]") break;
				const json = JSON.parse(value.data);
				response += json.choices?.[0]?.delta?.content ?? "";
			}

			if (response) {
				chatHistory.push({ role: "assistant", content: response });
			}
		} catch (e) {
			errorModal?.setErrorMessage(e instanceof Error ? e.message : String(e));
			errorModal?.showErrorModal();
		} finally {
			isExecuting = false;
		}
	}

	const chatHistory = $state<ChatHistory>([]);

	function createChatRequest(
		chatContext: ChatContext,
		chatHistory: ChatHistory,
		taskId: 1 | 2
	): ChatRequest {
		if (taskId === 1) {
			return {
				chatContext: {
					role: "user",
					type: "context",
					context: {
						taskId: taskId,
						taskPrompt: chatContext.taskPrompt,
						taskImage: "",
						responseText: chatContext.taskResponse
					}
				},
				chatHistory: chatHistory.map((v) => ({ role: v.role, type: "content", content: v.content }))
			};
		} else {
			return {
				chatContext: {
					role: "user",
					type: "context",
					context: {
						taskId: taskId,
						taskPrompt: chatContext.taskPrompt,
						responseText: chatContext.taskResponse
					}
				},
				chatHistory: chatHistory.map((v) => ({ role: v.role, type: "content", content: v.content }))
			};
		}
	}

	const handleChatSubmit = async () => {
		if (chatInput.trim() === "") {
			return;
		}

		if (taskId !== 1 && taskId !== 2) {
			return;
		}

		chatHistory.push({ role: "user", content: chatInput });
		chatInput = "";

		const chatRequest = createChatRequest(taskContext, chatHistory, taskId);
		await executeChat(chatRequest);
	};
</script>

<div class="flex h-full flex-col gap-2 p-3">
	<div
		class="prose flex max-w-none flex-1 flex-col gap-2 overflow-y-auto prose-p:my-0 prose-p:py-0">
		{#if chatHistory.length === 0}
			<div class="flex flex-1 flex-col items-center justify-center gap-2 text-base-content/75">
				<MessagesSquare size="2em" />
				No chats yet.
			</div>
		{:else}
			{#each chatHistory as chat, index (index)}
				<div
					class={[
						"chat",
						chat.role === "assistant" && "chat-start",
						chat.role === "user" && "chat-end"
					]}>
					<div class="chat-header">{chat.role === "user" ? "You" : "Assistant"}</div>

					<div class={["chat-bubble", { "chat-bubble-primary": chat.role === "user" }]}>
						{@html marked.parse(chat.content)}
					</div>
				</div>
			{/each}
		{/if}
		{#if response && isExecuting}
			<div class="chat-start chat">
				<div class="chat-header">Assistant</div>
				<div class="chat-bubble">
					{@html marked.parse(response)}
				</div>
			</div>
		{/if}
	</div>

	<form class="join">
		<label class="input join-item flex-1">
			<input type="text" placeholder="Ask a question..." required bind:value={chatInput} />
		</label>
		<button class="btn join-item btn-primary" disabled={isExecuting} onclick={handleChatSubmit}>
			<span class="hidden sm:inline">Send</span>
			<Send size="1em" />
		</button>
	</form>
</div>
