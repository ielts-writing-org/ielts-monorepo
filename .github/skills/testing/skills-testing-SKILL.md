# Testing

Use this skill when creating, updating, or evaluating tests.

## Goal

Create tests that provide meaningful confidence in application behavior and protect important contracts from regression.

## Workflow

### 1. Identify the Behavior

Before writing a test, determine:

- What behavior is being tested?
- What is the public contract?
- What inputs matter?
- What outputs matter?
- What failure cases matter?

Do not begin by testing implementation details.

### 2. Choose the Test Level

Choose the smallest appropriate level:

- Unit test.
- Integration test.
- API test.
- Component test.
- End-to-end test.
- AI evaluation test.

Prefer unit tests for isolated deterministic logic.

Use integration tests when interaction between components is important.

Use end-to-end tests for critical user workflows.

### 3. Test the Happy Path

Verify the expected behavior using representative valid input.

### 4. Test Failure Paths

Consider:

- Invalid input.
- Missing data.
- Unauthorized access.
- Forbidden access.
- Not-found resources.
- Database failure.
- External API failure.
- AI provider failure.
- Invalid AI output.
- Timeout.
- Network interruption.

### 5. Test Boundary Conditions

Examples:

- Empty essay.
- Very short essay.
- Long essay.
- Minimum/maximum values.
- Missing optional fields.
- Duplicate requests.
- Multiple concurrent requests.

Only test boundaries relevant to the feature.

### 6. AI Testing

Do not make ordinary unit tests dependent on live LLM behavior.

Prefer deterministic provider mocks.

Test:

- Prompt construction.
- Context selection.
- Schema validation.
- Parsing.
- Error handling.
- Retry behavior.
- Request deduplication.
- Stale result handling.

### 7. IELTS Evaluation Testing

Use representative writing samples when testing evaluation behavior.

Include examples covering:

- Task Response.
- Coherence and Cohesion.
- Lexical Resource.
- Grammatical Range and Accuracy.

Do not assume one essay represents the complete IELTS scoring domain.

### 8. AI Score Evaluation

When comparing AI scores with human scores, treat the task as an evaluation experiment rather than an ordinary unit test.

Useful metrics include:

- Exact agreement.
- Absolute score difference.
- MAE.
- ±0.5 band agreement.
- Criterion-level agreement.

Do not require a live model to produce one exact score in a normal unit test unless deterministic behavior has been explicitly established.

### 9. Streaming Tests

Test state transitions:

Idle
→ Connecting
→ Streaming
→ Completed

and:

Streaming
→ Failed

and:

Streaming
→ Cancelled/Disconnected

Verify that incomplete streams do not appear as successful final results.

### 10. Race Condition Tests

When multiple requests may overlap, test the ordering explicitly.

Example:

- Request A uses essay version 1.
- Request B uses essay version 2.
- B completes first.
- A completes later.

Verify that the stale result does not overwrite the newer result.

### 11. Regression Tests

For a bug fix:

1. Reproduce the failure.
2. Add a regression test when practical.
3. Apply the fix.
4. Verify the regression test passes.

Do not weaken the test merely to accommodate the implementation.

### 12. Test Independence

Tests should not depend on:

- Execution order.
- Previous test state.
- Local developer data.
- External service availability.

Reset or isolate mutable state as necessary.

### 13. Test Quality

Avoid tests that:

- Duplicate implementation details.
- Assert irrelevant internal calls.
- Depend on exact timing unnecessarily.
- Require unstable external services.
- Provide no meaningful protection.

Prefer assertions about observable behavior.

## Completion Criteria

A testing task is complete when:

- Important behavior is covered.
- Relevant failure paths are considered.
- Tests are deterministic where possible.
- AI behavior is separated from live provider dependency.
- Regression coverage exists when appropriate.
- Relevant test commands have actually been executed.