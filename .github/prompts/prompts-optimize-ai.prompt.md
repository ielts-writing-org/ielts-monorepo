---
description: Analyze and optimize IELTS AI evaluation quality, latency, token usage, request frequency, and reliability.
---

# Optimize AI System

Analyze and optimize the following AI functionality:

> [Describe the AI functionality or problem here]

## Primary Objective

Optimize:

- [ ] Evaluation quality
- [ ] Feedback quality
- [ ] IELTS criterion alignment
- [ ] Latency
- [ ] Time to first response
- [ ] Token usage
- [ ] LLM request count
- [ ] Reliability
- [ ] Streaming
- [ ] Conversational context
- [ ] Cost

Do not optimize one metric blindly at the expense of the others.

## Current Behavior

Describe the current implementation:

> [Describe current behavior]

## Problem

Describe the observed problem:

> [Describe problem]

## Investigation

Inspect:

- AI request flow.
- Prompt construction.
- Context construction.
- Model configuration.
- Output schema.
- Runtime validation.
- Request triggers.
- Debouncing.
- Caching.
- Duplicate requests.
- Streaming.
- Error handling.
- Persistence.
- Frontend state management.

## Quality Analysis

Check whether the AI:

- Uses the correct IELTS criterion.
- Uses sufficient context.
- Provides evidence from the learner's writing.
- Gives actionable feedback.
- Avoids hallucinated issues.
- Avoids unsupported scores.
- Preserves the learner's intended meaning.

## Efficiency Analysis

Check:

- Number of LLM requests.
- Input token size.
- Output token size.
- Repeated context.
- Duplicate requests.
- Full-essay reprocessing.
- Opportunities for incremental analysis.
- Opportunities for caching or reuse.
- Model selection.

## Near-Real-Time Analysis

Determine whether the current trigger strategy is appropriate.

Do not assume that faster feedback always requires more frequent LLM requests.

Consider:

- Debounce.
- Sentence-level analysis.
- Paragraph-level analysis.
- Explicit analysis.
- Significant-change detection.
- Request cancellation.
- Stale-result protection.

## Reliability Analysis

Check handling of:

- Invalid output.
- Schema mismatch.
- Timeout.
- Rate limit.
- Provider failure.
- Network failure.
- Stream interruption.
- Empty response.
- Duplicate request.
- Stale response.

## Evaluation

If evaluation data is available, compare the current and proposed approaches using measurable metrics.

For scoring:

- Exact agreement.
- Absolute score difference.
- MAE.
- ±0.5 band agreement.
- Criterion-level agreement.

For feedback:

- Relevance.
- Correctness.
- Specificity.
- Criterion alignment.
- Actionability.

For system performance:

- TTFR.
- Completion latency.
- Token usage.
- Request count.
- Cost.
- Error rate.

Do not claim an optimization is better without evidence when measurable evaluation is possible.

## Constraints

- Preserve existing API contracts unless explicitly changing them.
- Preserve valid user data.
- Do not introduce unnecessary infrastructure.
- Do not remove context solely for token savings if evaluation quality is harmed.
- Do not invent IELTS scoring rules.
- Do not expose private model reasoning.
- Do not hardcode secrets.

## Implementation

If a concrete improvement is justified:

1. Explain the root cause.
2. Explain the proposed change.
3. Identify affected files.
4. Implement the smallest reasonable change.
5. Validate the implementation.
6. Compare the result against the original behavior where possible.

## Final Response

Report:

1. Root cause or bottleneck.
2. Recommended optimization.
3. Changes made.
4. Expected impact.
5. Trade-offs.
6. Metrics or validation performed.
7. Remaining risks.