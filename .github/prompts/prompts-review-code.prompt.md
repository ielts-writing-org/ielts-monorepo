---
description: Review the current code changes for correctness, security, architecture, performance, reliability, and maintainability.
---

# Review Code

Review the current changes in the repository.

Do not modify the code unless explicitly requested.

## Review Priorities

Prioritize actual defects over subjective style preferences.

Check for:

- Incorrect behavior.
- Broken API contracts.
- Type safety problems.
- Missing runtime validation.
- Authentication or authorization issues.
- Database correctness.
- Error handling problems.
- Async race conditions.
- Resource leaks.
- Performance problems.
- Security vulnerabilities.
- Unnecessary complexity.
- Regression risks.

## Backend Review

Check:

- Request validation.
- Authentication.
- Authorization.
- Service boundaries.
- Dependency injection.
- Database queries.
- Error handling.
- External API handling.
- Async behavior.

## Frontend Review

Check:

- Component responsibilities.
- State management.
- Loading/error/empty states.
- API error handling.
- Race conditions.
- Stale data.
- Accessibility.
- Unnecessary requests or re-renders.

## AI Review

If AI functionality is involved, check:

- Prompt correctness.
- Context selection.
- IELTS criterion alignment.
- Structured output.
- Runtime validation.
- Provider failure handling.
- Token usage.
- Request frequency.
- Stale evaluation results.
- Streaming behavior.
- Hallucinated or unsupported feedback.

## IELTS Review

For Task 2, verify:

- Task Response.
- Coherence and Cohesion.
- Lexical Resource.
- Grammatical Range and Accuracy.

For Task 1, verify:

- Task Achievement.
- Coherence and Cohesion.
- Lexical Resource.
- Grammatical Range and Accuracy.

Check that feedback and scores are attributed to the correct criterion.

Do not treat AI-generated scores as objective ground truth.

## Severity

Classify findings as:

- Critical
- High
- Medium
- Low

Only report an issue when there is a concrete reason it matters.

## Review Output

For each finding provide:

- Severity.
- File and relevant location.
- Problem.
- Why it matters.
- Recommended direction.

Separate confirmed issues from potential risks.

If no significant issues are found, explicitly state that no significant correctness, security, architecture, or reliability issues were identified.