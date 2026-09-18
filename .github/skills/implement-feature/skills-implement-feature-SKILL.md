# Implement Feature

Use this skill when implementing a new feature or extending an existing feature.

## Goal

Implement the requested behavior with the smallest reasonable change while preserving the existing architecture and conventions.

## Workflow

### 1. Understand the Requirement

Before changing code, identify:

- What behavior is required?
- Who uses the feature?
- What inputs are involved?
- What output or side effect is expected?
- What existing behavior must remain unchanged?
- What are the likely edge cases?

Do not start coding from the feature description alone if the repository contains relevant existing behavior.

### 2. Explore the Repository

Search for:

- Similar features.
- Related routes.
- Related components.
- Existing services.
- Existing schemas.
- Existing types.
- Existing API calls.
- Existing tests.

Prefer extending an existing pattern over creating a new one.

### 3. Define the Change Boundary

Identify:

- Files that need to change.
- Files that may need to be added.
- Existing interfaces that must remain compatible.
- Data flow affected by the change.

Avoid modifying unrelated files.

### 4. Implement from the Existing Architecture

Follow the repository's existing:

- Naming conventions.
- Folder structure.
- Dependency injection.
- Validation.
- Error handling.
- API conventions.
- UI patterns.
- Testing patterns.

Do not introduce a new architecture unless the existing architecture cannot reasonably support the feature.

### 5. Handle Edge Cases

Consider at minimum:

- Empty input.
- Invalid input.
- Missing data.
- Duplicate requests.
- Authentication failures.
- Authorization failures.
- External service failures.
- Network failures.
- Concurrent operations.

Only implement edge-case behavior that is supported by the existing domain or requirement. Do not invent business rules.

### 6. Validate the Implementation

Run relevant:

- Unit tests.
- Integration tests.
- Type checking.
- Linting.
- Formatting.
- Build checks.

Inspect the final diff.

### 7. Self-Review

Before finishing, verify:

- The requested behavior exists.
- Existing behavior remains intact.
- No unrelated changes were introduced.
- Error handling is appropriate.
- Security implications are addressed.
- Performance is reasonable.
- Types and runtime validation are correct.

## When the Feature Involves AI

Additionally determine:

- Whether an LLM is actually necessary.
- What minimum context is required.
- Whether the request can be debounced.
- Whether existing AI results can be reused.
- Whether the response requires structured output.
- How invalid AI output is handled.
- What happens when the provider fails.
- Whether the feature can create excessive token usage.

Do not automatically call an LLM for every user interaction.

## Completion Criteria

A feature is complete when:

- The requested behavior is implemented.
- The implementation follows existing project architecture.
- Relevant validation has been performed.
- Important failure cases are handled.
- No unnecessary refactoring has been introduced.

When reporting the result, distinguish between completed changes, checks actually run, assumptions, and known limitations.