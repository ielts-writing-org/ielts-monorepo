<script lang="ts">
	import { errorModal } from "$lib/components/ErrorModal.svelte";
	import { ChatHandler, type ChatContext } from "$lib/features/chat/handler.svelte";
	import { Send } from "@lucide/svelte";
	import { marked } from "marked";

	type ChatPanelProps = {
		// TODO: Add evaluations if existed
		taskContext: { topic: string; response: string };
	};

	const { taskContext }: ChatPanelProps = $props();

	let chatInput = $state<string>("");

	const chatHandler = new ChatHandler();
	chatHandler.onEnd = () => {
		if (chatHandler.isSuccess && chatHandler.response) {
			chatContext.push({ role: "assistant", type: "content", content: chatHandler.response });
		} else if (chatHandler.errorMessage) {
			errorModal?.setErrorMessage(chatHandler.errorMessage);
			errorModal?.showErrorModal();
		}
	};

	const chatContext = $state<ChatContext>([]);

	const handleChatSubmit = async () => {
		if (chatInput.trim() === "") {
			return;
		}
		chatContext.shift();
		chatContext.unshift({
			role: "user",
			type: "context",
			context: {
				topic: taskContext.topic,
				response_text: taskContext.response
			}
		});

		chatContext.push({ role: "user", type: "content", content: chatInput });
		chatInput = "";
		await chatHandler.execute(chatContext);
	};
</script>

<div
	class="prose flex max-h-[50dvh] max-w-none flex-2 flex-col gap-2 overflow-y-auto rounded-md border border-base-content/20 bg-base-100 p-3 prose-p:my-0 prose-p:py-0">
	{#if chatContext.filter((chat) => chat.type === "content").length === 0}
		<div class="text-base-content/75">No chats yet.</div>
	{:else}
		{#each chatContext.filter((chat) => chat.type === "content") as chat, index (index)}
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
	{#if chatHandler.response && chatHandler.isExecuting}
		<div class="chat-start chat">
			<div class="chat-header">Assistant</div>
			<div class="chat-bubble">
				{@html marked.parse(chatHandler.response)}
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
		disabled={chatHandler.isExecuting}
		onclick={handleChatSubmit}>
		<span class="hidden sm:inline">Send</span>
		<Send size="1em" />
	</button>
</form>
