---
applyTo: "**/*"
---

# Architecture Guidelines

This file defines architectural rules for the IELTS Writing AI platform.

The repository's existing architecture is the primary source of truth. These rules should guide implementation without overriding established project patterns unless the existing pattern is clearly incorrect or explicitly being changed.

# General Principles

Prefer a clear separation of responsibilities.

A typical feature should separate concerns such as:

- HTTP or UI concerns.
- Application logic.
- Domain logic.
- Data access.
- External service integration.
- Validation.
- Infrastructure.

Do not introduce layers only for the sake of having more layers.

The goal is to keep responsibilities understandable and testable.

# Existing Architecture First

Before implementing a feature:

1. Locate similar existing features.
2. Identify their structure.
3. Follow their dependency direction.
4. Reuse their abstractions.
5. Only introduce a different structure when there is a concrete reason.

Do not create a new architectural pattern for a single feature when an existing pattern already solves the problem.

# Dependency Direction

Prefer dependencies flowing from higher-level behavior toward well-defined abstractions.

Avoid unnecessary coupling between:

- UI components and database code.
- HTTP handlers and database implementation details.
- Domain logic and framework-specific APIs.
- AI business logic and a specific LLM provider.
- Infrastructure details and domain models.

When an external provider is involved, prefer an abstraction that allows the application logic to remain independent from the provider implementation.

# Feature Boundaries

Keep related behavior close to the feature that owns it.

For example, IELTS evaluation logic should not be scattered across:

- HTTP routes.
- UI components.
- Database queries.
- AI provider adapters.

A feature should have a clear owner for its business behavior.

Avoid creating generic utilities when the behavior is specific to one domain feature.

# Domain Logic

Domain rules should be explicit.

Important domain concepts include:

- Writing.
- Essay.
- Writing task.
- Task 1.
- Task 2.
- IELTS criteria.
- Feedback.
- Evaluation.
- Score.
- Paragraph.
- Sentence.
- Conversation.
- AI usage.

Do not encode domain rules implicitly in UI code or request handlers when they are expected to be reused.

# AI Provider Isolation

Do not couple core application logic directly to one LLM provider.

Provider-specific behavior should remain isolated where practical.

Examples of provider-specific concerns:

- API request format.
- Model identifier.
- Authentication.
- Streaming protocol.
- Provider-specific error format.
- Token usage metadata.
- Rate-limit handling.

Application-level AI behavior should work with a stable internal representation where possible.

# Data Flow

Prefer explicit data flow:

Input
→ Validation
→ Application Logic
→ Domain/Service Logic
→ Infrastructure
→ Result
→ Response

Avoid hidden side effects that make the data flow difficult to understand.

# Validation Boundaries

Validate data at trust boundaries.

Typical boundaries include:

- HTTP requests.
- User input.
- Database results when required.
- External APIs.
- LLM responses.
- Environment configuration.

TypeScript types alone do not provide runtime validation.

Use the project's Zod-based validation conventions where appropriate.

# State and Side Effects

Make side effects explicit.

Examples:

- Database writes.
- LLM requests.
- Authentication operations.
- External API calls.
- Streaming connections.
- Queue operations.

Avoid performing significant side effects unexpectedly during simple data transformation.

# Persistence Boundaries

Business logic should not depend unnecessarily on database-specific implementation details.

Database-specific concerns should remain in the appropriate persistence/data-access layer.

Do not spread SQL or database access logic throughout unrelated application code.

# External Services

External services must be treated as unreliable dependencies.

Code integrating external services should account for:

- Timeout.
- Failure.
- Invalid response.
- Rate limiting.
- Partial response.
- Authentication failure.
- Network interruption.

Do not assume external services always return successful or correctly formatted responses.

# Error Boundaries

Errors should be handled at the layer that has enough context to make the correct decision.

For example:

- Validation errors should be handled as validation failures.
- Domain errors should remain distinguishable from infrastructure failures.
- Provider failures should not be presented as successful AI feedback.
- Unexpected internal errors should not expose implementation details.

Do not catch errors merely to suppress them.

# API Contracts

API contracts should be explicit and stable.

When changing an API:

- Check existing consumers.
- Check frontend usage.
- Check tests.
- Check validation schemas.
- Check persisted data if relevant.

Avoid silently changing response shapes.

# AI and Domain Separation

Do not mix IELTS domain rules with provider-specific prompt construction.

For example:

The definition of `Task Response` belongs to the application/domain layer.

The exact prompt sent to an LLM belongs to the AI integration layer.

This separation makes AI provider and prompt changes safer.

# Architectural Changes

For a significant architectural change:

1. Identify the current limitation.
2. Identify affected modules.
3. Explain the proposed dependency direction.
4. Consider migration impact.
5. Consider backwards compatibility.
6. Avoid mixing unrelated feature work with the architectural change.

Do not perform large-scale architectural refactoring as part of a small feature unless explicitly requested.