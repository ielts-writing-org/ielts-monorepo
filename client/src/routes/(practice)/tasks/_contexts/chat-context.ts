import type { ChatMessage } from '@ielts/shared';
import { createContext } from 'svelte';

export type ChatContext = ChatMessage[];

export const [getChatContext, setChatContext, hasChatContext] = createContext<ChatContext>();
