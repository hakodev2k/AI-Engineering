# Safe Default Rules

## Purpose
Define deterministic behavior when flag evaluation is unavailable, stale, malformed, or ambiguous.

## Scope
Client and server flag evaluation, bootstrap configuration, and dependency failure.

## MUST
- Every flag MUST define an explicit default for evaluation failure.
- Defaults MUST be selected from failure impact, not convenience.
- Security-sensitive behavior MUST fail in the safer direction unless an approved threat model requires otherwise.
- Default behavior MUST be tested without network access to the flag service.

## MUST NOT
- Missing flag values MUST NOT produce undefined application behavior.
- Code MUST NOT assume the remote flag service is always reachable.
- A default MUST NOT unintentionally expose unreleased or unauthorized functionality.

## SHOULD
- Defaults SHOULD preserve core service availability when this does not weaken security or data integrity.

## Exceptions
A nonconservative default requires documented impact analysis, evidence, and approval.

## Verification
Run dependency-failure tests, inspect SDK initialization, configuration fallbacks, and security tests.