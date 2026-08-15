import { chatRequestSchema } from '@ielts/shared';
import { validator } from 'hono-openapi';

export const validateTask2ChatRequest = validator('json', chatRequestSchema);
