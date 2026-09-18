---
description: Investigate and fix a bug by identifying its root cause and applying a focused regression-safe fix.
---

# Fix Bug

Investigate and fix the following bug:

> [Describe the bug here]

## Expected Behavior

[Describe what should happen.]

## Actual Behavior

[Describe what currently happens.]

## Reproduction Steps

1. [Step 1]
2. [Step 2]
3. [Step 3]

## Constraints

- Identify the root cause before implementing the fix.
- Inspect the relevant data flow.
- Prefer the smallest correct fix.
- Do not refactor unrelated code.
- Do not change existing behavior outside the affected area unless necessary.
- Do not hide the symptom without addressing the underlying cause.

## Investigation

Inspect, where relevant:

- Related components.
- API routes.
- Services.
- Validation schemas.
- Database queries.
- State management.
- Async operations.
- AI requests.
- Streaming behavior.
- Recent changes.

## Regression Protection

When practical:

1. Reproduce the bug in a test.
2. Add or update a regression test.
3. Implement the fix.
4. Verify the test passes.

## Validation

Run relevant:

- Tests.
- Type checking.
- Linting.
- Build checks.

Also verify the original reproduction scenario.

Do not claim validation passed unless it was actually executed.

## Final Response

Report:

1. Root cause.
2. Fix applied.
3. Files changed.
4. Regression coverage.
5. Validation performed.
6. Any remaining limitations.