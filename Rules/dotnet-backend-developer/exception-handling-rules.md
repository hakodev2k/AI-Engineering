# Exception Handling Rules

## Purpose
Preserve failure semantics, diagnostic evidence, and stable boundaries.

## Scope
Applies to application code, APIs, workers, integrations, and persistence layers.

## MUST
- Unexpected exceptions MUST preserve original diagnostic context.
- Exception translation MUST occur only at intentional abstraction boundaries.
- Expected domain/application failures SHOULD use explicit result or exception semantics consistently.
- Retryable failures MUST be distinguishable from permanent failures.
- API exception handling MUST map internal failures to safe client responses while preserving server-side diagnostics.

## MUST NOT
- MUST NOT silently swallow unexpected exceptions.
- MUST NOT catch broad exceptions merely to return a default success value.
- MUST NOT log and rethrow the same failure redundantly at every layer.
- MUST NOT expose stack traces, connection strings, secrets, or internal implementation details to clients.

## SHOULD
- Prefer exception filters or specific exception types for targeted handling.
- Include correlation/context needed to investigate failures.

## Exceptions
Any deliberate error suppression requires documented business semantics, evidence that loss is acceptable, and observability.

## Verification
Use unit/integration tests for expected and unexpected failures, log inspection, API error-contract tests, and failure injection.