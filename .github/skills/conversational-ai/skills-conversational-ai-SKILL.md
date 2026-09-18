# Conversational AI

Use this skill when implementing or modifying the conversational AI experience.

## Goal

Allow learners to ask follow-up questions about their writing and AI feedback while preserving enough context to produce a useful answer without unnecessarily sending large amounts of data.

## Conversation Context Model

Think of conversational context as:

Essay
→ Paragraph
→ Sentence
→ Feedback
→ Criterion
→ User Question

The closer the conversation is to a specific feedback item, the more specific the context should be.

## Workflow

### 1. Identify the User's Intent

Determine whether the user is asking about:

- Grammar.
- Vocabulary.
- Coherence.
- Task Response.
- Task Achievement.
- Score.
- A specific feedback item.
- A sentence.
- A paragraph.
- The essay overall.
- A suggested rewrite.
- A general IELTS question.

Do not assume the user's intent solely from the latest message if the conversation already establishes relevant context.

### 2. Identify Relevant Context

Collect only the context necessary to answer the question.

Possible context:

- User's question.
- Relevant sentence.
- Relevant paragraph.
- Essay question.
- Existing feedback.
- IELTS criterion.
- Previous conversation turns.

Avoid sending unrelated essay content.

### 3. Preserve Meaning

Context reduction must not remove information necessary to answer correctly.

For example, explaining whether an argument sufficiently answers the task may require:

- Task question.
- Relevant paragraph.
- Relevant feedback.

Sending only one sentence may be insufficient.

### 4. Handle Follow-Up Questions

The learner may ask:

"Why?"

"Can you explain that?"

"What should I change?"

"Is this grammar wrong?"

These short questions depend heavily on previous context.

Preserve the relevant conversation context instead of treating each message as an independent request.

### 5. Explain Before Rewriting

When the learner asks why something is wrong, prioritize:

- Explanation.
- Reason.
- Relevant IELTS criterion.
- Improvement principle.

Only rewrite the text when appropriate.

Do not automatically replace the learner's writing.

### 6. Preserve User Intent

AI suggestions should not unnecessarily change:

- Meaning.
- Position.
- Tone.
- Intended argument.

A grammatically improved sentence that changes the learner's intended meaning is not a valid improvement.

### 7. Context Size

Do not automatically send the entire conversation history.

Prefer a relevant context window.

Consider:

- Current question.
- Relevant previous messages.
- Referenced feedback.
- Referenced writing content.

The objective is:

Minimum Context
+
Sufficient Meaning

### 8. AI Failure

Handle:

- Timeout.
- Rate limit.
- Network failure.
- Invalid response.
- Interrupted stream.
- Provider failure.

A failed conversational request should not destroy existing conversation history.

### 9. Streaming

For streamed conversational responses:

- Show partial output appropriately.
- Handle completion.
- Handle interruption.
- Handle errors.
- Prevent stale responses from replacing newer responses.

Do not treat incomplete streamed text as a completed answer.

### 10. Conversation Persistence

If conversation history is persisted, preserve enough metadata to identify relevant context where the application architecture supports it.

Useful associations may include:

- Essay ID.
- Writing version.
- Feedback ID.
- Criterion.
- Sentence or paragraph reference.

Do not invent persistence fields without checking the existing schema.

## Testing

Test:

- New conversation.
- Follow-up question.
- Context preservation.
- Short ambiguous follow-up.
- Feedback-specific question.
- Provider failure.
- Stream interruption.
- Stale response.
- Conversation persistence.

## Completion Criteria

A conversational feature is complete when:

- Relevant context is preserved.
- Unnecessary context is minimized.
- Follow-up questions work correctly.
- User intent is preserved.
- AI failures are handled.
- Streaming state is correct when applicable.
- Existing conversation data is not corrupted.