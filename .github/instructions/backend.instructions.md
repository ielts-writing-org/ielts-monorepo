---
applyTo: "**/*.{ts,tsx}"
---

# Backend Guidelines

The backend uses:

- Node.js
- TypeScript
- Hono
- Zod
- InferDI
- Better Auth

Follow the existing backend structure before introducing new patterns.

# Request Lifecycle

Prefer a clear request lifecycle:

Request
→ Middleware
→ Validation
→ Authentication/Authorization
→ Handler
→ Application/Service Logic
→ Data/External Services
→ Response

Do not put substantial business logic directly inside route definitions or HTTP handlers when the existing architecture provides service/application layers.

# Hono

Follow the repository's existing conventions for:

- Route definitions.
- Middleware.
- Context usage.
- Error handling.
- Response formatting.
- Route composition.

Keep Hono-specific code close to the HTTP boundary.

Do not make domain services depend unnecessarily on Hono request/response objects.

# Validation

Use Zod for runtime validation where appropriate.

Validate:

- Request bodies.
- Query parameters.
- Route parameters.
- External API responses.
- AI responses.
- Configuration values when required.

Do not assume TypeScript types guarantee runtime safety.

Prefer reusable schemas when the same contract is used in multiple places.

# Type Safety

Avoid unnecessary:

- `any`.
- Unsafe type assertions.
- Non-null assertions.
- Duplicate interfaces.

Prefer types derived from validation schemas where appropriate.

If a type assertion is genuinely necessary, make sure the invariant supporting it is clear.

# Dependency Injection

The project uses InferDI.

Follow the existing dependency registration and resolution pattern.

Do not manually instantiate dependencies that should be managed by InferDI.

Prefer dependency injection for:

- Services.
- Repositories.
- AI clients.
- External integrations.
- Infrastructure components.

Avoid introducing a service locator pattern outside the established InferDI architecture.

# Authentication

Better Auth handles authentication.

Follow the existing session and authentication architecture.

Do not implement a second authentication mechanism.

Authentication answers:

"Who is this user?"

Authorization answers:

"Is this user allowed to perform this operation?"

Do not confuse the two.

# Authorization

Authorization must be enforced server-side.

Never rely solely on:

- Hidden UI controls.
- Client-side role checks.
- Client-provided user IDs.
- Client-provided permission values.

Verify resource ownership and permissions before sensitive operations.

# Services

Services should contain application or domain behavior rather than HTTP-specific logic.

Avoid services that:

- Depend unnecessarily on Hono context.
- Return HTTP responses directly.
- Know about UI concerns.

Prefer returning meaningful domain/application results that the HTTP layer can translate into responses.

# Database Access

Follow the repository's existing database/data-access architecture.

Before modifying database code:

- Inspect the schema.
- Inspect existing queries.
- Search for similar operations.
- Understand relationships.
- Check indexes when performance matters.

Do not invent columns or tables.

Use parameterized queries or the project's safe database abstraction.

Avoid unnecessary database round trips.

# Transactions

Use transactions when multiple writes must succeed or fail together.

Do not introduce transactions blindly for independent operations.

When changing data across related entities, consider:

- Atomicity.
- Consistency.
- Partial failure.
- Retry behavior.

# External APIs

Treat external API responses as untrusted input.

Validate important response data before using it.

Handle:

- Timeout.
- Network failure.
- Rate limit.
- Invalid response.
- Unexpected status.
- Provider-specific errors.

Do not leak provider credentials or raw internal errors to clients.

# AI Integration

AI calls are external network operations.

They should be:

- Explicit.
- Validated.
- Observable where appropriate.
- Failure-aware.
- Cost-conscious.

Do not place raw LLM calls throughout unrelated services.

Prefer a dedicated AI integration boundary.

# Streaming

When using SSE or other streaming mechanisms:

- Handle connection lifecycle.
- Handle partial output.
- Handle completion.
- Handle errors.
- Handle client disconnects.
- Clean up resources.
- Avoid duplicate processing.

Do not assume the client will remain connected until completion.

# Async Operations

Consider failure behavior for asynchronous operations.

Do not create unhandled promises.

Be explicit about whether an operation:

- Must complete before returning.
- Can run asynchronously.
- Can be retried.
- Can be cancelled.

# Error Handling

Use the existing project error model.

Distinguish between:

- Validation errors.
- Authentication errors.
- Authorization errors.
- Not-found errors.
- Business/domain errors.
- External service errors.
- Unexpected internal errors.

Do not return `200 OK` for failed operations merely to simplify client handling.

# Logging

Logs should provide enough information to diagnose failures without exposing sensitive data.

Never log:

- API keys.
- Passwords.
- Authentication tokens.
- Sensitive personal information.
- Full private user content unless explicitly required and appropriately protected.

# Environment Variables

Never hardcode secrets or credentials.

Environment variables should be validated when necessary.

Do not assume an environment variable exists without handling missing configuration appropriately.

# Backend Performance

Pay particular attention to:

- Database query count.
- N+1 queries.
- Large payloads.
- Repeated external requests.
- Repeated LLM requests.
- Unnecessary serialization.
- Blocking operations.

Do not optimize prematurely, but do not introduce obviously expensive operations into frequently executed paths.