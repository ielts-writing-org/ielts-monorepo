# Project Overview

This repository contains an IELTS Writing practice platform that integrates AI-powered feedback and conversational UX.

The main goal of the system is to help learners improve their IELTS Writing skills through continuous practice, AI-assisted evaluation, contextual feedback, and follow-up conversations.

The platform is not designed to be only an essay scoring tool. It should support the learning cycle:

Writing
→ Feedback
→ Understanding
→ Asking questions
→ Revising
→ Improving

The system focuses primarily on IELTS Writing Task 2 in the initial scope, while the architecture should avoid unnecessary assumptions that would make future support for other writing tasks difficult.

# Core Product Goals

The platform should support:

- Writing and managing IELTS Writing essays.
- AI-assisted essay evaluation.
- Evaluation based on IELTS Writing criteria.
- Near-real-time feedback where appropriate.
- Contextual feedback linked to relevant writing content.
- Conversational interaction with AI.
- Writing history and progress tracking.
- AI usage management.
- Subscription or usage-limit mechanisms.

The system should balance:

- Feedback quality.
- Response latency.
- LLM token usage.
- Operational cost.
- User experience.
- Maintainability.

# Technology Stack

## Backend

- Node.js
- TypeScript
- Hono
- Zod
- InferDI
- Better Auth

## Frontend

- Svelte
- SvelteKit
- Vite
- TypeScript

## Infrastructure

The application is designed to use the Cloudflare ecosystem where appropriate.

Potential services may include:

- Cloudflare Workers.
- Cloudflare D1.
- Cloudflare KV.
- Cloudflare R2.
- Durable Objects.
- Cloudflare Queues.
- Other Cloudflare services when justified by the architecture.

Do not introduce a Cloudflare service unless there is a clear technical reason.

## AI

The platform integrates external Large Language Models through APIs.

AI functionality may include:

- Essay evaluation.
- IELTS criterion analysis.
- Grammar and language feedback.
- Contextual explanations.
- Writing improvement suggestions.
- Conversational follow-up.
- Streaming AI responses.

The application does not train or build a Large Language Model from scratch.

# Domain Context

The platform is an educational application focused on IELTS Writing.

AI should act as a learning assistant, not only as an automated scoring system.

Feedback should help learners understand:

- What is weak or incorrect.
- Why it is weak or incorrect.
- Which IELTS criterion is affected.
- How the writing can be improved.

When appropriate, feedback should prioritize explanation and guidance over simply rewriting the learner's text.

Do not unnecessarily replace the user's entire writing with an AI-generated version.

# IELTS Writing Criteria

For IELTS Writing Task 2, evaluation is based on four criteria:

1. Task Response (TR)
2. Coherence and Cohesion (CC)
3. Lexical Resource (LR)
4. Grammatical Range and Accuracy (GRA)

These criteria should remain conceptually distinct.

Do not mix feedback from different criteria without a clear reason.

When the system provides a score or feedback for a criterion, the explanation should correspond to that criterion.

AI-generated scores should be treated as estimates rather than objective ground truth.

Do not invent IELTS scoring rules or criteria.

# AI Feedback Principles

The system aims to provide near-real-time feedback.

Near-real-time does not mean sending every user keystroke to an LLM.

Before implementing an AI request, determine:

1. Whether AI reasoning is actually required.
2. What is the smallest useful scope of text to analyze.
3. Whether existing feedback can be reused.
4. Whether the request duplicates an existing analysis.
5. Whether deterministic processing can solve the problem.

Prefer deterministic processing for tasks such as:

- Word counting.
- Character counting.
- Basic validation.
- Input validation.
- Usage limits.
- Authentication state.
- Subscription state.
- Simple formatting checks.

Use an LLM when semantic understanding or contextual reasoning is required.

Examples include:

- Evaluating argument development.
- Analyzing coherence.
- Evaluating vocabulary usage in context.
- Explaining grammar problems.
- Answering follow-up questions about feedback.

# AI Request Strategy

Avoid unnecessary LLM requests.

Do not implement a full-essay LLM evaluation for every keystroke.

Consider strategies such as:

- Debouncing.
- Explicit user actions.
- Paragraph-level analysis.
- Sentence-level analysis.
- Completion-based analysis.
- Incremental analysis.
- Reusing previous results.
- Caching where appropriate.

The objective is to balance:

Accuracy
↕
Context
↕
Latency
↕
Token Cost

Do not optimize for token cost alone if reducing context would significantly reduce feedback quality.

# AI Output

LLM output is probabilistic and must be treated as external data.

Never assume that an LLM response is:

- Correct.
- Complete.
- Deterministic.
- Valid JSON.
- Consistent with previous responses.
- Automatically aligned with IELTS criteria.

Machine-consumed AI responses must have a defined structure.

Validate AI output before using it in application logic.

Use the project's runtime validation mechanisms, such as Zod, where appropriate.

Do not blindly access fields from an unvalidated LLM response.

# Conversational UX

The conversational system should preserve relevant context between the learner's question and existing feedback.

Relevant context may include:

- The essay.
- The relevant paragraph.
- The relevant sentence.
- The feedback item.
- The IELTS criterion.
- Previous relevant conversation.

Do not automatically send the entire essay and complete conversation history for every user message.

Select the smallest context that preserves the meaning of the interaction.

For example, a question such as:

"Why is this sentence weak?"

should be associated with the relevant sentence and feedback when that context is available.

The conversational system should help the learner understand and improve rather than simply generate replacement answers.

# Streaming

AI responses may be streamed to improve perceived responsiveness.

When implementing streaming:

- Handle partial responses.
- Handle completion.
- Handle errors.
- Handle interrupted connections.
- Handle request cancellation when supported.
- Ensure resources are cleaned up.
- Prevent the UI from remaining permanently in a loading state.

Partial streamed output should not automatically be treated as a final validated result.

If structured output is required, validate the completed result before using it as machine-readable application data.

# General Development Principles

Before implementing a feature:

1. Understand the requested behavior.
2. Inspect the existing repository.
3. Search for similar implementations.
4. Identify the affected modules.
5. Reuse existing patterns where appropriate.
6. Make the smallest reasonable change.

Do not create new abstractions, architectural layers, dependencies, or infrastructure services unless they provide a clear benefit.

Prefer simple and maintainable solutions over unnecessary complexity.

# Type Safety

Use TypeScript effectively.

Prefer:

- Explicit domain types when appropriate.
- Type inference when it improves readability.
- Runtime validation for external data.
- Reusable schemas and types.
- Narrow types over overly broad types.

Avoid:

- Unnecessary `any`.
- Unsafe type assertions.
- Duplicated type definitions.
- Treating TypeScript types as runtime validation.

Remember that data received from:

- HTTP requests.
- External APIs.
- LLMs.
- Databases when schema guarantees are uncertain.
- Environment variables.
- User-generated content.

may require runtime validation.

# Validation

Validate untrusted external input.

Follow existing project conventions for validating:

- Request bodies.
- Query parameters.
- Route parameters.
- External API responses.
- AI responses.

Use Zod or the existing validation mechanism where appropriate.

# Architecture

Always inspect the existing architecture before adding new code.

Follow established boundaries between:

- UI and presentation.
- Application or business logic.
- Domain logic.
- Infrastructure.
- External services.

Do not place complex business logic directly in UI components or HTTP route handlers when the project architecture provides a more appropriate layer.

Do not bypass existing abstractions without a clear reason.

# Dependency Injection

The project uses InferDI for dependency management.

Follow the existing dependency injection conventions.

Do not manually instantiate dependencies that are already expected to be managed by the dependency injection container.

Reuse registered dependencies and existing service interfaces where possible.

# Backend

The backend uses Hono.

Follow the existing patterns for:

- Routing.
- Middleware.
- Validation.
- Dependency injection.
- Authentication.
- Authorization.
- Error handling.
- Response structures.

Keep HTTP-specific concerns separate from business logic where the existing architecture supports that separation.

# Frontend

The frontend uses Svelte and SvelteKit.

Follow existing conventions for:

- Component organization.
- Routing.
- Data loading.
- Server/client boundaries.
- State management.
- Error handling.
- Loading states.

Reuse existing UI components before creating new ones.

Avoid duplicating business logic across multiple components.

# Authentication and Authorization

Better Auth is used for authentication.

Follow the existing authentication and session management architecture.

Never trust authentication or authorization information supplied directly by the client without server-side verification.

Do not implement custom authentication logic that duplicates existing Better Auth functionality unless explicitly required.

# Database and Persistence

Before modifying persistence-related code:

1. Inspect the existing schema.
2. Inspect related models and queries.
3. Search for existing repository or data-access patterns.
4. Follow migration conventions.
5. Preserve data integrity.

Do not invent:

- Tables.
- Columns.
- Relationships.
- Constraints.

Use safe and parameterized database access mechanisms.

Consider query efficiency and avoid unnecessary database operations.

# Error Handling

Handle errors at the appropriate layer.

Errors should not:

- Be silently ignored.
- Expose sensitive internal information.
- Leave the UI in an inconsistent state.
- Cause user data to be lost unnecessarily.

Follow existing error-handling conventions.

Do not expose:

- Stack traces.
- API keys.
- Database credentials.
- Internal infrastructure details.

# Security

Never:

- Hardcode secrets.
- Commit API keys.
- Expose credentials.
- Trust unvalidated external input.
- Trust client-provided authorization data.
- Treat LLM output as inherently safe.
- Render untrusted content as executable HTML without proper protection.

Follow secure practices appropriate to the existing project architecture.

# Performance

Consider performance when changes affect:

- Database access.
- Network requests.
- LLM calls.
- Streaming.
- Large essays.
- Repeated computations.

Avoid:

- Duplicate requests.
- N+1 database queries.
- Repeated full-essay analysis when a smaller scope is sufficient.
- Blocking operations when asynchronous processing is appropriate.
- Unnecessary large payloads.

Optimize only when there is a meaningful benefit.

Do not introduce unnecessary caching or infrastructure complexity prematurely.

# Testing and Verification

After implementing a change:

- Run relevant tests when available.
- Run type checking when available.
- Run linting when available.
- Check formatting.
- Inspect the final diff.

Verify:

- The requested behavior works.
- Existing behavior is not unintentionally changed.
- Edge cases are considered.
- Error cases are handled.

Do not claim that a test or validation passed unless it was actually executed.

# Change Scope

Keep changes focused.

Do not:

- Refactor unrelated code.
- Rename unrelated files.
- Reformat unrelated files.
- Replace existing patterns merely based on personal preference.
- Introduce a new architecture for a small feature.

If broader refactoring would be beneficial but is outside the requested scope, mention it separately rather than silently including it.

# When Information Is Missing

Do not invent:

- Business rules.
- IELTS scoring rules.
- Database schema.
- API contracts.
- User permissions.
- Subscription behavior.
- AI provider behavior.

First inspect the repository.

If the required information still cannot be determined and the ambiguity materially affects the implementation, ask for clarification.

Do not ask for clarification when the repository already provides sufficient information.

# Final Development Checklist

Before considering a task complete, verify:

- The implementation satisfies the requirement.
- Existing architecture is respected.
- Changes are limited to the required scope.
- Types are correct.
- External data is validated.
- Error handling is appropriate.
- Security implications are considered.
- Database access is safe.
- AI calls are necessary and efficient.
- LLM output is validated.
- Streaming states are handled correctly when applicable.
- No secrets or debugging code remain.
- Relevant checks were executed when available.

When reporting completed work, clearly distinguish between:

- Changes actually made.
- Validation actually performed.
- Assumptions.
- Known limitations.
- Suggested future improvements.