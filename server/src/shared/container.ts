import { Container } from '@inferdi/inferdi';
import { registerTask2Container } from '@/features/task2/container';

export type RootContainer = ReturnType<typeof buildRootContainer>;

export function buildRootContainer() {
	return new Container({ fast: true }).use(registerTask2Container);
}
