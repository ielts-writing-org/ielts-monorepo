# AI Feedback

Use this skill when implementing, modifying, or evaluating AI-powered IELTS Writing feedback.

## Goal

Build AI feedback that is:

- Relevant.
- Correct.
- Criterion-aligned.
- Actionable.
- Efficient.
- Robust against invalid model output.
- Responsive enough for the intended user experience.

## Workflow

### 1. Define the Feedback Objective

Before implementing the AI call, determine exactly what the AI must evaluate.

Examples:

- Grammar of a sentence.
- Vocabulary usage.
- Paragraph coherence.
- Task Response.
- Overall essay evaluation.
- Explanation of existing feedback.

Do not combine unrelated evaluation objectives into one prompt unless there is a clear reason.

### 2. Determine the Evaluation Scope

Choose the smallest useful scope:

- Sentence.
- Paragraph.
- Essay.
- Task prompt.
- Existing feedback.
- Relevant conversation context.

Do not send the entire essay when the requested feedback only requires one sentence.

However, preserve enough context when the criterion requires broader understanding.

### 3. Determine Whether AI Is Necessary

Use deterministic logic for tasks such as:

- Word count.
- Character count.
- Input validation.
- Usage limits.
- Request eligibility.

Use an LLM for semantic tasks such as:

- Argument quality.
- Task Response.
- Coherence.
- Contextual vocabulary.
- Grammar explanation.
- Contextual rewriting.

### 4. Construct the Input

Build a structured internal representation containing only relevant context.

Typical fields may include:

- Task type.
- Task question.
- Essay text.
- Relevant paragraph.
- Relevant sentence.
- Target criterion.
- Existing feedback.
- User question.

Do not include unrelated user information.

### 5. Construct the Prompt

The prompt should clearly define:

- Evaluation role.
- Task.
- IELTS criterion.
- Relevant context.
- Evaluation requirements.
- Output requirements.
- Constraints.

The prompt should require evidence from the learner's actual writing.

Avoid vague instructions such as:

"Give good IELTS feedback."

Prefer a clearly defined evaluation objective.

### 6. Request Structured Output

If the result is consumed by application logic, define a structured schema.

For example, an evaluation may contain:

- Criterion.
- Issues.
- Evidence.
- Explanation.
- Suggested improvement.
- Estimated band where applicable.

Do not rely on free-form text when the frontend or backend requires structured data.

### 7. Validate the Output

Treat the LLM response as untrusted external data.

Validate:

- Required fields.
- Types.
- Enum values.
- Score ranges.
- Criterion names.
- Nested structures.

Use Zod or the project's existing validation mechanism.

If validation fails:

- Do not persist invalid data.
- Do not silently convert it into a successful result.
- Handle the failure according to the existing AI error strategy.

### 8. Check Criterion Alignment

Verify that feedback belongs to the requested IELTS criterion.

For Task 2:

- Task Response.
- Coherence and Cohesion.
- Lexical Resource.
- Grammatical Range and Accuracy.

For Task 1:

- Task Achievement.
- Coherence and Cohesion.
- Lexical Resource.
- Grammatical Range and Accuracy.

Do not confuse Task Response and Task Achievement.

### 9. Handle Near-Real-Time Feedback

Do not trigger an LLM request on every keystroke.

Choose an appropriate trigger:

- Debounced input.
- Sentence completion.
- Paragraph completion.
- Significant text change.
- Explicit user action.

Before creating a new request, consider whether an existing evaluation can be reused.

### 10. Handle Stale Results

Associate feedback with the relevant writing version when possible.

Example:

Essay version 10
→ AI request A

Essay version 11
→ AI request B

If B completes first, A should not overwrite B.

Use an appropriate version, request ID, timestamp, cancellation mechanism, or equivalent strategy.

### 11. Handle Provider Failure

Account for:

- Timeout.
- Rate limit.
- Network failure.
- Invalid response.
- Empty response.
- Provider outage.
- Authentication failure.
- Model unavailability.

A failed AI request must not corrupt the learner's writing.

### 12. Control Cost

Before sending an AI request, consider:

- Input token size.
- Output token size.
- Request frequency.
- Repeated context.
- Duplicate requests.
- Model selection.
- Caching.
- Incremental analysis.

Do not reduce context solely to save tokens when it materially harms evaluation quality.

### 13. Evaluate Feedback Quality

When reviewing AI feedback, check:

- Relevance.
- Correctness.
- Specificity.
- Criterion alignment.
- Actionability.
- Evidence from the learner's text.

Reject or flag feedback that:

- Refers to text that does not exist.
- Invents quotations.
- Attributes issues to the wrong criterion.
- Changes the intended meaning unnecessarily.
- Gives unsupported scoring claims.

## Score Handling

Treat AI scores as estimates.

Do not describe them as objectively correct IELTS scores.

When evaluating score quality against human assessments, use measurable metrics such as:

- Exact agreement.
- Absolute score difference.
- MAE.
- Agreement within ±0.5 band.
- Criterion-level agreement.

Do not optimize the system against a single essay.

## Streaming

If the AI response is streamed:

- Distinguish partial output from final output.
- Handle interruption.
- Handle connection failure.
- Handle completion.
- Validate the final structured result.

Do not persist incomplete structured feedback as a completed evaluation.

## Testing

Test deterministic AI-related code independently from live model behavior.

Test:

- Prompt construction.
- Context construction.
- Schema validation.
- Invalid model output.
- Provider failure.
- Stale results.
- Request deduplication.
- Streaming state transitions.

Use mocked provider responses for normal automated tests where appropriate.

## Completion Criteria

An AI feedback feature is complete when:

- The evaluation objective is clearly defined.
- The appropriate text scope is selected.
- The prompt is explicit.
- Output is validated.
- IELTS criterion mapping is correct.
- Failure cases are handled.
- Stale results are controlled.
- Token/request usage is reasonable.
- Relevant tests or validation are completed.