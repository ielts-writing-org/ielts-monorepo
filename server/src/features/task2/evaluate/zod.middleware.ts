import { task2EvaluationRequestSchema } from '@ielts/shared';
import { validator } from 'hono-openapi';

export const validateTask2EvaluateRequest = validator('json', task2EvaluationRequestSchema);
