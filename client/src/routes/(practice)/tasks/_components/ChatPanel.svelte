<script lang="ts">
	import { Send } from "@lucide/svelte";
	import { marked } from "marked";
	import { type ChatContext } from "../_contexts/chat-context";
	import { getHandlerContext } from "../_contexts/handler-context";
	import { getTaskContext } from "../_contexts/task-context";

	const taskContext = getTaskContext();
	const handlerContext = getHandlerContext();
	const chatContext = $state<ChatContext>([
		{
			role: "user",
			type: "context",
			context: {
				topic: taskContext.task_2.topic,
				response_text: taskContext.task_2.response
			}
		}
	]);
	let chatInput = $state<string>("");

	handlerContext.task2ChatHandler.onEnd = (isSuccess) => {
		if (isSuccess && handlerContext.task2ChatHandler.result) {
			chatContext.push({
				role: "assistant",
				type: "content",
				content: handlerContext.task2ChatHandler.result
			});
		}
	};

	const handleChatSubmit = async () => {
		if (chatInput.trim() === "") return;

		chatContext.push({
			role: "user",
			type: "content",
			content: chatInput
		});

		chatInput = "";

		await handlerContext.task2ChatHandler.run(chatContext);
	};
</script>

<div
	class="prose flex max-h-[50dvh] max-w-none flex-2 flex-col gap-2 overflow-y-auto rounded-md border border-base-content/20 bg-base-100 p-3 prose-p:my-0 prose-p:py-0">
	{#if chatContext.length <= 1}
		<div class="text-base-content/75">No chats yet.</div>
	{:else}
		{#each chatContext as chat, index (index)}
			{#if chat.type === "content"}
				<div
					class={[
						"chat",
						{ "chat-start": chat.role === "assistant" },
						{ "chat-end": chat.role === "user" }
					]}>
					<div class="chat-header">{chat.role === "user" ? "You" : "Assistant"}</div>

					<div class={["chat-bubble", { "chat-bubble-primary": chat.role === "user" }]}>
						<!-- eslint-disable-next-line svelte/no-at-html-tags -->
						{@html marked.parse(chat.content)}
					</div>
				</div>
			{/if}
		{/each}
	{/if}
	{#if handlerContext.task2ChatHandler.result && handlerContext.task2ChatHandler.isRunning}
		<div class="chat-start chat">
			<div class="chat-header">Assistant</div>
			<div class="chat-bubble">
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				{@html marked.parse(handlerContext.task2ChatHandler.result)}
			</div>
		</div>
	{/if}
</div>

<form class="join">
	<label class="input join-item flex-1">
		<input type="text" placeholder="Ask a question..." required bind:value={chatInput} />
	</label>
	<button
		class="btn join-item btn-primary"
		disabled={handlerContext.task2ChatHandler.isRunning}
		onclick={handleChatSubmit}>
		<span class="hidden sm:inline">Send</span>
		<Send size="1em" />
	</button>
</form>
