# Fix Bug

Use this skill when investigating and fixing an existing bug.

## Goal

Identify the actual root cause, apply the smallest reliable fix, and prevent the bug from returning.

## Workflow

### 1. Reproduce the Problem

Determine:

- Expected behavior.
- Actual behavior.
- Steps to reproduce.
- Relevant input.
- Relevant user state.
- Environment in which the problem occurs.

Do not assume the reported symptom is the root cause.

### 2. Trace the Data Flow

Follow the behavior through the relevant layers.

For backend issues:

Request
→ Middleware
→ Validation
→ Handler
→ Service
→ Database/External Service
→ Response

For frontend issues:

User Action
→ Component
→ State
→ API
→ Response
→ State Update
→ UI

For AI issues:

Input
→ Context Construction
→ Prompt
→ Provider
→ Response
→ Parsing
→ Validation
→ Persistence/UI

### 3. Find the Root Cause

Inspect:

- Recent changes.
- Similar implementations.
- Type definitions.
- Validation.
- State transitions.
- Async behavior.
- Database queries.
- External API responses.
- Error handling.

Do not fix symptoms if the underlying cause can be identified.

### 4. Implement the Smallest Correct Fix

Prefer a focused fix.

Avoid:

- Unrelated refactoring.
- Large rewrites.
- New dependencies.
- Architecture changes without justification.

Preserve existing behavior outside the affected path.

### 5. Add Regression Coverage

When practical, add a test that reproduces the bug before the fix.

The test should fail with the buggy behavior and pass after the fix.

### 6. Validate

Run the most relevant checks.

At minimum, verify the original reproduction scenario.

Also run:

- Relevant tests.
- Type checking.
- Linting.
- Build checks when appropriate.

### 7. Review for Side Effects

Check whether the fix affects:

- Other users.
- Other routes.
- Shared components.
- Existing API contracts.
- Database state.
- AI requests.
- Streaming behavior.
- Authentication/authorization.

## Common Bug Categories

Pay particular attention to:

### State Bugs

- Stale state.
- Incorrect state synchronization.
- State updates arriving out of order.
- Duplicated sources of truth.

### Async Bugs

- Race conditions.
- Missing cancellation.
- Unhandled promises.
- Duplicate requests.
- Incorrect loading state.

### Backend Bugs

- Incorrect validation.
- Authorization bypass.
- Incorrect database filtering.
- Partial writes.
- Incorrect error mapping.

### AI Bugs

- Wrong context.
- Wrong criterion.
- Stale evaluation.
- Invalid structured output.
- Hallucinated feedback.
- Duplicate LLM requests.
- Excessive token usage.

### Streaming Bugs

- Lost events.
- Duplicate events.
- Incomplete output treated as final.
- Connection not cleaned up.
- UI stuck in loading state.

## Completion Criteria

The bug is considered fixed when:

- The root cause is understood.
- The original problem is resolved.
- Existing behavior is preserved.
- A regression test exists when practical.
- Relevant validation passes.

Do not report a bug as fixed solely because the visible symptom disappeared without understanding the cause.