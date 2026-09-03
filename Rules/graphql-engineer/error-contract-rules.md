# Error Contract Rules

## Purpose
Provide predictable GraphQL error semantics without leaking sensitive implementation detail.

## Scope
Applies to validation, authorization, domain, dependency, and unexpected execution failures.

## MUST
- Expected domain failures MUST use documented machine-readable error codes or typed payload semantics.
- Unexpected failures MUST preserve diagnostic correlation internally while returning sanitized client-facing messages.
- Partial-success behavior MUST be intentional and documented where nullable fields permit continued execution.
- Error extensions exposed to clients MUST be reviewed for sensitive data leakage.

## MUST NOT
- MUST NOT expose stack traces, SQL, secrets, tokens, internal hostnames, or raw dependency errors.
- MUST NOT return successful domain payloads when the requested state change failed.
- MUST NOT silently convert authorization failures into ambiguous nulls when that would mislead clients.

## SHOULD
- SHOULD keep transport-level and domain-level error semantics distinct.
- SHOULD make retryability explicit for transient failures when clients can act on it safely.

## Exceptions
Exceptions require security review when additional diagnostic detail is exposed externally.

## Verification
Use contract tests, security tests, snapshot review of error payloads, and log correlation checks.