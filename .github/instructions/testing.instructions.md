---
applyTo: "**/*.{test,spec}.{ts,tsx,js,svelte}"
---

# Testing Guidelines

Tests should provide confidence in behavior rather than simply increase coverage numbers.

Prefer tests that verify observable behavior and important failure cases.

# General Principles

A good test should be:

- Focused.
- Deterministic.
- Readable.
- Independent.
- Repeatable.
- Meaningful.

Avoid tests that depend unnecessarily on:

- Timing.
- External services.
- Randomness.
- Network availability.
- Shared mutable state.

# Test Priorities

Prioritize testing:

1. Business-critical behavior.
2. Domain rules.
3. Authentication and authorization.
4. Data integrity.
5. AI output validation.
6. Error handling.
7. Streaming behavior.
8. Important UI interactions.
9. Performance-sensitive behavior when relevant.

# Backend Tests

Test backend behavior at the appropriate level.

Important cases include:

- Valid requests.
- Invalid requests.
- Missing parameters.
- Authentication failures.
- Authorization failures.
- Resource ownership.
- Not-found cases.
- Business-rule violations.
- Database failures.
- External service failures.

Do not test framework behavior that the framework itself guarantees unless the application adds meaningful behavior around it.

# Validation Tests

For Zod schemas and runtime validation, test:

- Valid input.
- Missing required fields.
- Invalid types.
- Invalid enum values.
- Boundary values.
- Unexpected data.

For AI responses, test malformed and semantically invalid structures where appropriate.

# Authentication Tests

Authentication tests should verify the actual application behavior.

Authorization tests should explicitly verify that users cannot access resources they do not own or do not have permission to access.

Do not only test the happy path.

# Database Tests

When database behavior is important, verify:

- Correct records are created.
- Correct records are updated.
- Unrelated records are not modified.
- Ownership constraints are respected.
- Transactions preserve consistency when applicable.

Avoid tests that depend on an unspecified database state.

# AI Tests

Do not rely solely on live LLM calls in ordinary automated tests.

Prefer testing:

- Prompt construction.
- Input transformation.
- Output schema validation.
- Response parsing.
- Error handling.
- Provider adapters.
- Retry behavior.
- Streaming event handling.

Use mocked or deterministic provider responses where appropriate.

# AI Evaluation Tests

For IELTS evaluation logic, include representative cases covering:

- Task Response.
- Coherence and Cohesion.
- Lexical Resource.
- Grammatical Range and Accuracy.

Do not assume one essay is representative of all writing.

When evaluation datasets are available, use them to compare changes to prompts or models.

# AI Score Tests

AI scores are probabilistic.

Do not write brittle tests that require a live LLM to return one exact score unless the test is specifically designed as an evaluation experiment.

Instead, test deterministic parts such as:

- Score schema.
- Valid band range.
- Criterion mapping.
- Output parsing.
- Persistence.
- Aggregation rules when deterministic.

# Streaming Tests

Streaming tests should cover:

- Connection establishment.
- Partial events.
- Final event.
- Error event.
- Interrupted stream.
- Client disconnect.
- Duplicate events where relevant.
- Cleanup.

Ensure that incomplete streams do not produce a falsely successful final state.

# Frontend Tests

Test important user-visible behavior.

Examples:

- Form submission.
- Validation errors.
- Loading states.
- Error states.
- Feedback rendering.
- Conversation interactions.
- Editor behavior.
- Unsaved changes.
- AI request state transitions.

Do not over-test implementation details that are invisible to users.

# Race Conditions

Test concurrent request scenarios where they can affect correctness.

For example:

1. User edits essay.
2. AI request A starts.
3. User edits essay again.
4. AI request B starts.
5. B completes.
6. A completes later.

The older result should not overwrite the newer result when the application is expected to prevent that.

# Error Handling Tests

Every important external dependency should have failure-path tests.

Consider:

- Timeout.
- Rate limit.
- Network error.
- Invalid response.
- Empty response.
- Authentication failure.
- Unexpected provider behavior.

The application should fail predictably.

# Regression Tests

When fixing a bug:

1. Reproduce the bug.
2. Add a regression test when practical.
3. Implement the fix.
4. Verify the regression test passes.

Do not remove a test simply because the implementation changed.

# Test Isolation

Tests should not depend on execution order.

Avoid shared mutable state between tests.

Reset relevant state between tests when necessary.

# Test Quality

Avoid tests that merely mirror implementation details.

A refactor that preserves behavior should not require rewriting large numbers of tests unless the tested contract genuinely changed.

Prefer testing public behavior and stable contracts.

# Validation Before Completion

When modifying code, run the most relevant available checks:

- Unit tests.
- Integration tests.
- Type checking.
- Linting.
- Build checks.

Do not claim validation succeeded unless it was actually executed.

# Test Failures

When a test fails:

1. Determine whether the failure is caused by the change.
2. Check whether the test itself is outdated.
3. Check whether the environment is responsible.
4. Do not blindly modify the test to make it pass.

Tests are part of the application's correctness contract.