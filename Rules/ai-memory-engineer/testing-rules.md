# Memory Testing Rules

## Purpose
Prevent regressions across memory write, retrieval, lifecycle, security, and failure behavior.

## Scope
Unit, integration, contract, adversarial, migration, deletion, and end-to-end testing.

## MUST
- Critical write and retrieval policies MUST have deterministic tests for edge cases and conflicts.
- Security tests MUST cover cross-user and cross-tenant isolation.
- Lifecycle tests MUST verify expiry, deletion, revocation, and restore behavior.
- Migration tests MUST prove old memories remain interpretable or are transformed safely.
- Adversarial tests MUST include poisoning, prompt-injection, stale-memory, and unauthorized-retrieval cases.

## MUST NOT
- MUST NOT rely only on happy-path retrieval tests.
- MUST NOT ignore flaky memory tests; they MUST be investigated or quarantined with ownership.
- MUST NOT use production-sensitive data in tests without authorization and safeguards.

## SHOULD
- Maintain regression fixtures from real incidents after sanitization.
- Include representative memory volume and skew in performance-sensitive tests.

## Exceptions
Unautomatable checks require documented manual evidence and reviewer ownership.

## Verification
Inspect CI results, fixtures, adversarial coverage, isolation tests, migration tests, and incident regressions.