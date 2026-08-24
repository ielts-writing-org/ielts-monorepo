import type { Task2EvaluationCriterion, Task2EvaluationResponse } from '@ielts/shared';
import JSONParser from '@streamparser/json/jsonparser.js';
import { EventSourceParserStream } from 'eventsource-parser/stream';
import { evaluateTask2 } from '../_apis/evaluation-api.svelte';

const EMPTY_CRITERION: Task2EvaluationCriterion = {
	band: null,
	checks: [],
	problems: [],
	why_this_band: '',
	why_not_next_band: null
};

const CRITERIA_KEYS = [
	'task_response',
	'coherence_and_cohesion',
	'lexical_resource',
	'grammatical_range_and_accuracy'
] as const satisfies readonly (keyof Task2EvaluationResponse['criteria'])[];

const isCriteriaKey = (key: unknown): key is (typeof CRITERIA_KEYS)[number] =>
	CRITERIA_KEYS.includes(key as (typeof CRITERIA_KEYS)[number]);

export class Task2EvaluationHandler {
	result = $state<Task2EvaluationResponse | undefined>();
	isEvaluating = $state(false);
	error = $state<string | null>(null);

	async run(topic: string, response: string) {
		try {
			this.isEvaluating = true;
			this.error = null;
			this.result = {
				criteria: {
					task_response: { ...EMPTY_CRITERION },
					coherence_and_cohesion: { ...EMPTY_CRITERION },
					lexical_resource: { ...EMPTY_CRITERION },
					grammatical_range_and_accuracy: { ...EMPTY_CRITERION }
				},
				overall_band: null
			};

			const stream = await evaluateTask2({ topic, response_text: response });
			const reader = stream.pipeThrough(new EventSourceParserStream()).getReader();

			const parser = new JSONParser({ paths: ['$', '$.*', '$.criteria.*'] });
			parser.onValue = ({ key, stack, value }) => {
				if (!this.result || !value) return;
				if (stack.length === 1 && key === 'overall_band') {
					this.result.overall_band = value as Task2EvaluationResponse['overall_band'];
				} else if (stack.length === 2 && stack[1]?.key === 'criteria' && isCriteriaKey(key)) {
					this.result.criteria[key] = value as Task2EvaluationCriterion;
				}
			};

			while (true) {
				const { done, value } = await reader.read();
				if (done || value?.data === '[DONE]') {
					if (!this.result.overall_band) throw new Error('overall_band missing');
					break;
				}
				parser.write(JSON.parse(value.data).choices?.[0]?.delta?.content ?? '');
			}
		} catch (e) {
			this.error = e instanceof Error ? e.message : String(e);
		} finally {
			this.isEvaluating = false;
		}
	}
}
