import type { Container, Spec } from '@inferdi/inferdi';
import { CONTAINER_CLASSES, CONTAINER_SCOPE_INPUTS } from '../shared/config';
import type { ConfigsProvider } from '../shared/configs-provider.port';
import { CloudflareChatClient } from './chat-client.cloudflare';

export function registerTask2ChatContainer(
	c: Container<{
		[CONTAINER_CLASSES.configsProvider]: Spec<ConfigsProvider, 'scoped'>;
	}>
) {
	return c
		.declareScopeInputs<{
			[CONTAINER_SCOPE_INPUTS.ai]: Ai;
		}>()
		.registerClass(
			CONTAINER_CLASSES.chatClient,
			CloudflareChatClient,
			[CONTAINER_SCOPE_INPUTS.ai, CONTAINER_CLASSES.configsProvider],
			'scoped'
		);
}
