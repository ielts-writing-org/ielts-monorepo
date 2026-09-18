---
description: Implement a new feature or extend an existing feature following the project's architecture and conventions.
---

# Implement Feature

Implement the following feature:

> [Describe the feature here]

## Requirements

- [Requirement 1]
- [Requirement 2]
- [Requirement 3]

## Expected Behavior

Describe the expected behavior from the user's perspective.

## Constraints

- Follow the existing project architecture.
- Search for similar implementations before creating new patterns.
- Reuse existing components, services, utilities, schemas, and types where appropriate.
- Do not introduce unnecessary dependencies.
- Do not modify unrelated code.
- Do not invent business rules, database structures, or API contracts.

## Implementation Process

Before making changes:

1. Inspect the repository structure.
2. Find related implementations.
3. Identify the affected modules.
4. Determine whether the feature requires backend, frontend, database, AI, or multiple layers.
5. Implement the smallest reasonable change.
6. Handle relevant error and edge cases.
7. Run appropriate validation.

## AI Considerations

If the feature involves AI:

- Determine whether an LLM is actually necessary.
- Minimize unnecessary LLM requests.
- Use the smallest sufficient context.
- Validate LLM output.
- Consider token usage and latency.
- Handle provider failures.
- Prevent stale AI results from overwriting newer content.

## Validation

Run relevant checks available in the repository:

- Tests.
- Type checking.
- Linting.
- Formatting.
- Build.

Do not claim a check passed unless it was actually executed.

## Final Response

Report:

1. What was implemented.
2. Important files changed.
3. Validation performed.
4. Assumptions.
5. Known limitations or follow-up work.