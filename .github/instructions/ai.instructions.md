---
applyTo: "**/*.{ts,tsx,svelte}"
---

# AI System Guidelines

The AI subsystem provides IELTS Writing evaluation, feedback, and conversational assistance.

LLM output must always be treated as probabilistic external data.

# AI Responsibilities

AI may be used for tasks requiring semantic understanding, such as:

- Task Response analysis.
- Coherence and Cohesion analysis.
- Lexical Resource analysis.
- Grammatical Range and Accuracy analysis.
- Contextual grammar explanations.
- Contextual vocabulary explanations.
- Writing improvement suggestions.
- Follow-up questions about feedback.
- Conversational tutoring.

Do not use an LLM when deterministic logic is sufficient.

# Deterministic vs AI Processing

Prefer deterministic processing for:

- Word count.
- Character count.
- Request validation.
- Usage limits.
- Authentication state.
- Subscription state.
- Basic formatting.
- Simple structural checks.

Prefer AI for semantic judgments that cannot be reliably implemented using deterministic rules.

# IELTS Criteria

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

Never confuse Task Response with Task Achievement.

Do not invent additional IELTS scoring criteria.

# Criterion Separation

Each criterion should have a clearly defined evaluation objective.

Do not attribute a problem to a criterion simply because it is convenient.

For example:

A vocabulary problem should primarily be associated with Lexical Resource.

A grammar problem should primarily be associated with Grammatical Range and Accuracy.

A weak argument that does not sufficiently answer the question should be evaluated in relation to Task Response.

A paragraph organization problem should be evaluated in relation to Coherence and Cohesion when appropriate.

A single issue may affect multiple criteria, but the system should avoid unnecessary duplication.

# Evaluation Structure

A useful evaluation flow is:

Essay
→ Task understanding
→ Criterion-specific analysis
→ Evidence
→ Estimated score
→ Explanation
→ Improvement guidance

Feedback should be grounded in observable evidence from the learner's writing.

Avoid vague outputs such as:

"Your essay is good."

Prefer feedback that explains:

- What was found.
- Where it occurs.
- Why it matters.
- Which criterion it affects.
- How the learner can improve.

# Scores

AI-generated IELTS scores are estimates.

Do not describe an AI score as an objectively correct IELTS score.

Where appropriate, evaluation results should preserve:

- Criterion.
- Estimated band.
- Supporting evidence.
- Explanation.
- Confidence or uncertainty if the system supports it.

Do not fabricate confidence values merely to make the result appear precise.

# Prompt Design

Prompts should clearly define:

1. Role.
2. Task.
3. Relevant writing context.
4. IELTS criterion.
5. Evaluation requirements.
6. Output constraints.

Avoid unnecessary instructions that increase prompt size without improving output quality.

Do not expose internal private reasoning.

Request concise explanations and observable evidence rather than hidden chain-of-thought.

# Context Selection

Send only context that is relevant to the current task.

Possible context levels:

- Sentence.
- Paragraph.
- Essay.
- Task prompt.
- Existing feedback.
- Relevant conversation history.

Do not automatically send the complete essay and conversation history when a smaller context is sufficient.

However, do not remove context merely to reduce token usage if doing so materially harms evaluation quality.

# Near-Real-Time Evaluation

Do not evaluate every keystroke with an LLM.

Prefer meaningful triggers such as:

- Debounced changes.
- Sentence completion.
- Paragraph completion.
- Explicit user request.
- Significant text changes.

Consider whether an existing analysis can be reused before starting another LLM request.

# Incremental Analysis

When possible, analyze only the affected scope.

For example:

If one sentence changes and the system can safely determine that only sentence-level grammar feedback is affected, do not automatically re-evaluate the entire essay.

However, changes to one sentence may affect:

- Coherence.
- Argument development.
- Paragraph structure.
- Overall task response.

The implementation should consider the criterion and scope rather than blindly applying sentence-level optimization.

# Token and Cost Management

Monitor factors such as:

- Request count.
- Input tokens.
- Output tokens.
- Repeated context.
- Duplicate requests.
- Model selection.
- Cached results.
- Analysis scope.

Do not optimize token usage at the expense of meaningful evaluation quality without explicitly considering the trade-off.

# Structured Output

Machine-consumed LLM responses must use a defined structure.

Validate the completed output at runtime.

Valid JSON is not sufficient.

The response must also conform to the expected schema and semantic constraints.

Use Zod or the project's existing runtime validation approach.

Never blindly access an LLM response field without validation when that field controls application behavior.

# Invalid AI Output

Handle:

- Malformed output.
- Missing fields.
- Incorrect types.
- Empty output.
- Unexpected values.
- Provider-specific response changes.

A failed AI response must not corrupt the learner's essay or application state.

# Provider Failures

AI providers may fail due to:

- Timeout.
- Rate limiting.
- Network failure.
- Service outage.
- Invalid request.
- Authentication failure.
- Model unavailability.

The application should handle these cases explicitly.

Do not present a failed request as successful feedback.

# Streaming

Streaming responses should distinguish between:

- Partial output.
- Completed output.
- Failed output.

Do not treat incomplete streamed content as a final validated evaluation.

If structured output is required, validate the completed result before persisting or using it as authoritative application data.

# Stale Results

AI evaluation results may become outdated when the learner continues editing.

Associate evaluations with an identifiable version or state of the writing when the architecture supports it.

Do not silently present feedback from an old essay version as feedback for the current text.

# Conversational AI

Conversation should preserve relevant relationships:

Essay
→ Paragraph
→ Sentence
→ Feedback
→ Criterion
→ User question

A follow-up question should use the smallest relevant context that preserves meaning.

For example, if the learner asks why a particular sentence received grammar feedback, provide the relevant sentence and feedback context rather than unnecessarily resending unrelated essay content.

# Feedback Quality

Evaluate AI feedback using dimensions such as:

- Relevance.
- Correctness.
- Specificity.
- Criterion alignment.
- Actionability.
- Explanation quality.

Do not assume that fluent AI output is correct.

An answer can be grammatically fluent while still providing incorrect IELTS feedback.

# Hallucination Detection

Be alert for:

- Incorrect quotations.
- Feedback about text that does not exist.
- Wrong criterion attribution.
- Unsupported score claims.
- Invented grammar problems.
- Irrelevant corrections.
- Changes that alter the learner's intended meaning.
- Contradictory feedback.

# Prompt and Model Changes

When changing prompts or models, consider effects on:

- Evaluation quality.
- Score distribution.
- Criterion consistency.
- Output schema.
- Token usage.
- Latency.
- Error rate.
- Existing persisted results.
- Frontend assumptions.

Do not judge a prompt improvement using a single example.

Prefer a representative evaluation dataset when available.

# AI Evaluation Metrics

When evaluating the scoring system against human assessment, consider:

- Exact band agreement.
- Absolute score difference.
- Mean Absolute Error (MAE).
- Agreement within ±0.5 band.
- Criterion-level agreement.
- Systematic score bias.

For feedback quality, consider:

- Relevance.
- Specificity.
- Correctness.
- Actionability.
- Criterion alignment.

For system performance, consider:

- Time to First Response.
- Completion latency.
- Token usage.
- Request count.
- Cost.
- Error rate.

# AI Safety and Privacy

Do not send unnecessary user information to external AI providers.

Do not include:

- Authentication secrets.
- API keys.
- Internal credentials.
- Unrelated private data.

Only send the content and context required for the AI task.

# AI Output and Trust

AI output should be treated as assistance, not unquestionable truth.

The application should allow the learner to understand that:

- Feedback may be imperfect.
- Scores are estimates.
- Suggestions should be reviewed.
- The learner remains responsible for the final writing.