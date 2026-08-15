import type { Container } from '@inferdi/inferdi';
import { registerTask2ChatContainer } from './chat/container';
import { registerTask2EvaluateContainer } from './evaluate/container';
import { CONTAINER_CLASSES, CONTAINER_SCOPE_INPUTS } from './shared/config';
import { CloudflareConfigsProvider } from './shared/configs-provider.cloudflare';

export function registerTask2Container(c: Container) {
	return c
		.declareScopeInputs<{
			[CONTAINER_SCOPE_INPUTS.kvNamespace]: KVNamespace;
		}>()
		.registerClass(
			CONTAINER_CLASSES.configsProvider,
			CloudflareConfigsProvider,
			[CONTAINER_SCOPE_INPUTS.kvNamespace],
			'scoped'
		)
		.use(registerTask2EvaluateContainer)
		.use(registerTask2ChatContainer);
}
