---
description: Design or implement an IELTS Writing AI feedback feature with correct criterion mapping, structured output, validation, and efficient LLM usage.
---

# AI Feedback Task

Implement or improve the following AI feedback functionality:

> [Describe the AI feedback requirement here]

## Evaluation Target

Target:

- Task type: [Task 1 / Task 2]
- Criterion: [TR / TA / CC / LR / GRA]
- Scope: [Sentence / Paragraph / Essay]
- Trigger: [Explicit action / Debounced change / Sentence completion / Other]

## Expected Feedback

The AI should help the learner understand:

1. What issue was identified.
2. Where the issue occurs.
3. Why it matters.
4. Which IELTS criterion it affects.
5. How the learner can improve it.

Do not generate vague feedback.

## Context

Determine the minimum context required for accurate evaluation.

Potential context:

- Task question.
- Essay.
- Paragraph.
- Sentence.
- Existing feedback.
- Previous relevant conversation.

Do not automatically send the entire essay if the task does not require it.

Do not remove context merely to reduce token usage when it is necessary for accurate evaluation.

## IELTS Criteria

For Task 2:

- Task Response (TR).
- Coherence and Cohesion (CC).
- Lexical Resource (LR).
- Grammatical Range and Accuracy (GRA).

For Task 1:

- Task Achievement (TA).
- Coherence and Cohesion (CC).
- Lexical Resource (LR).
- Grammatical Range and Accuracy (GRA).

Do not confuse Task Response with Task Achievement.

## AI Request

Before implementing the LLM call:

1. Determine whether deterministic logic could solve the problem.
2. Determine the smallest useful text scope.
3. Determine whether existing feedback can be reused.
4. Determine whether requests can overlap.
5. Determine whether the request needs streaming.

## Prompt Requirements

The prompt should explicitly define:

- Role.
- Task.
- IELTS criterion.
- Relevant writing context.
- Evaluation requirements.
- Evidence requirements.
- Output format.
- Constraints.

Do not request or expose private chain-of-thought.

Request concise reasoning based on observable evidence instead.

## Structured Output

Define a structured output schema appropriate for the feature.

Potential fields include:

- Criterion.
- Issue.
- Evidence.
- Explanation.
- Suggestion.
- Estimated band.

Do not add fields that are not required by the feature.

Validate the output using the project's runtime validation mechanism.

## Failure Handling

Handle:

- Invalid model output.
- Missing fields.
- Provider errors.
- Timeout.
- Rate limiting.
- Network failure.
- Empty response.
- Interrupted stream.

A failed AI request must not corrupt the learner's writing.

## Near-Real-Time Requirements

Do not call the LLM on every keystroke unless explicitly required and technically justified.

Consider:

- Debouncing.
- Meaningful text changes.
- Sentence completion.
- Paragraph completion.
- Request cancellation.
- Request deduplication.
- Result reuse.

## Cost and Latency

Consider:

- Input tokens.
- Output tokens.
- Number of requests.
- Context size.
- Repeated context.
- Model choice.
- Caching.
- Response latency.

Optimize the complete system rather than token usage alone.

## Validation

After implementation, verify:

- Criterion mapping.
- Prompt construction.
- Output schema.
- Runtime validation.
- Error handling.
- Stale result handling.
- Streaming behavior if applicable.
- Relevant tests.

## Final Response

Report:

1. AI behavior implemented.
2. Context strategy.
3. Prompt/schema changes.
4. Validation and error handling.
5. Token/latency considerations.
6. Tests performed.
7. Known limitations.