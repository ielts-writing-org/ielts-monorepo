import { task2ChatEndpoint } from './chat';
import { task2EvaluateEndpoint } from './evaluate';
import { factory } from '@/shared/app-env';

export const task2Endpoint = factory.createApp();

task2Endpoint.route('/evaluate', task2EvaluateEndpoint);
task2Endpoint.route('/chat', task2ChatEndpoint);
