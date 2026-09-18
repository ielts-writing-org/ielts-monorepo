import type { EvaluationRequest } from "ielts-shared/schemas/evaluation-request";
import { computeDeterministicStats } from "ielts-shared/utils/deterministic-stats";
import type EvaluationClient from "./evaluation-client.port";

type EvaluationCommand = {
	taskId: 1 | 2;
} & EvaluationRequest;

export default class EvaluationService {
	constructor(private readonly evaluationClient: EvaluationClient) {}

	evaluate = async (command: EvaluationCommand, signal: AbortSignal) => {
		return await this.evaluationClient.evaluate(
			{
				...command,
				deterministic: computeDeterministicStats(command.response_text)
			},
			signal
		);
	};
}
