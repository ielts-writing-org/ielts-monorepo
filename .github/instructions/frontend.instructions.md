---
applyTo: "**/*.{svelte,ts,js}"
---

# Frontend Guidelines

The frontend uses:

- Svelte.
- SvelteKit.
- Vite.
- TypeScript.

Follow the existing component, routing, state, and data-loading patterns in the repository.

# Component Design

Components should have focused responsibilities.

Prefer:

- Small reusable components.
- Clear inputs and outputs.
- Local state when state is local.
- Shared state only when genuinely shared.

Avoid large components that simultaneously handle:

- Complex UI.
- API communication.
- Domain logic.
- AI orchestration.
- Data transformation.

Move reusable business behavior to appropriate modules.

# Svelte

Follow the project's existing Svelte conventions.

Avoid unnecessary reactive state.

Prefer derived values over duplicated state when possible.

Do not create state merely because a value can be calculated from existing state.

# SvelteKit

Respect SvelteKit server/client boundaries.

Do not move server-only functionality into client-side code.

Server-side operations should remain server-side when they involve:

- Secrets.
- Authentication.
- Privileged database access.
- Server-only APIs.

# API Communication

Keep API communication consistent with the existing project architecture.

Handle:

- Loading.
- Success.
- Validation errors.
- Authentication errors.
- Authorization errors.
- Network failures.
- Unexpected server errors.

Do not assume every HTTP response represents a successful operation.

# State Management

Prefer the simplest state mechanism that satisfies the requirement.

Use local component state when possible.

Do not introduce a global state solution for state that belongs to a single feature.

Avoid duplicated sources of truth.

# Forms

Forms should provide clear:

- Validation.
- Loading state.
- Error state.
- Success behavior.
- Disabled state when submission is in progress.

Do not rely only on client-side validation for security or business-rule enforcement.

The backend remains authoritative.

# IELTS Writing Editor

The writing editor is a central part of the application.

Avoid unnecessarily disrupting the learner's writing flow.

Changes in the editor should not:

- Lose unsaved text.
- Trigger excessive network requests.
- Freeze the interface.
- Replace text unexpectedly.

Autosave and AI feedback should be treated as separate concerns where appropriate.

# AI Feedback UI

AI feedback may be asynchronous and probabilistic.

The UI should distinguish between:

- No feedback.
- Feedback requested.
- Feedback loading.
- Feedback partially received.
- Feedback completed.
- Feedback failed.
- Feedback outdated relative to the current text.

Do not display stale feedback as though it necessarily applies to the latest essay content.

# Near-Real-Time Feedback

Do not send an LLM request for every keystroke.

Use appropriate triggers such as:

- Debounce.
- Sentence completion.
- Paragraph completion.
- Explicit analysis.
- Meaningful text changes.

The UI should remain responsive while AI processing occurs.

# Streaming UI

For streaming responses:

- Show useful partial output when appropriate.
- Clearly indicate processing state.
- Handle completion.
- Handle errors.
- Handle interruption.
- Allow cancellation where supported.

Do not leave the interface permanently stuck in a loading state if the stream fails.

# Race Conditions

Be careful when multiple AI or API requests can overlap.

Example:

Request A analyzes an older version of an essay.

Request B analyzes a newer version.

If A finishes after B, its result should not overwrite B unless explicitly intended.

Use request identifiers, version numbers, timestamps, cancellation, or another appropriate mechanism.

# Feedback Mapping

AI feedback may refer to:

- Essay.
- Paragraph.
- Sentence.
- Phrase.
- IELTS criterion.

The UI should maintain enough context to display feedback against the correct writing content.

Do not rely solely on character offsets when the underlying text can change without version tracking.

# Accessibility

Interactive UI should support appropriate:

- Keyboard navigation.
- Focus management.
- Labels.
- Semantic elements.
- Screen-reader behavior.
- Error announcements where appropriate.

Do not sacrifice accessibility for visual convenience.

# Loading and Empty States

Every asynchronous feature should have appropriate states where relevant:

- Loading.
- Empty.
- Error.
- Success.

Avoid displaying blank UI that gives the impression that the application is broken.

# Error Messages

User-facing error messages should be understandable.

Do not expose:

- Stack traces.
- Raw server errors.
- Provider-specific internal errors.
- Database errors.

Technical details may be logged server-side when appropriate.

# Performance

Avoid unnecessary:

- Component re-renders.
- Large reactive computations.
- Repeated API calls.
- Full essay processing for small changes.
- Large client-side payloads.

Do not introduce complex performance mechanisms without evidence that they are necessary.

# UI Consistency

Reuse existing:

- Components.
- Form controls.
- Buttons.
- Modals.
- Feedback patterns.
- Loading indicators.
- Error presentation.

Do not create visually inconsistent versions of existing components unless the requirement genuinely differs.

# User Content

Essay content is user-generated data.

Do not:

- Modify user text unexpectedly.
- Discard unsaved changes.
- Treat AI suggestions as automatic replacements.
- Render untrusted content as executable HTML.

AI-generated content should be clearly distinguishable from user-authored content where appropriate.