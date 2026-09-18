import type { ChatRequest } from "ielts-shared/schemas/chat-request";
import { computeDeterministicStats } from "ielts-shared/utils/deterministic-stats";
import type ChatClient from "./chat-client.port";

type ChatCommand = ChatRequest;

export default class ChatService {
	constructor(private readonly chatClient: ChatClient) {}

	chat = async (command: ChatCommand, signal: AbortSignal) => {
		return await this.chatClient.chat(
			{
				chatContext: {
					...command.chatContext,
					deterministic: computeDeterministicStats(command.chatContext.context.responseText)
				},
				evaluation: command.evaluation,
				chatHistory: command.chatHistory
			},
			signal
		);
	};
}
