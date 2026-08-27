# API Contract Resilience Rules

## Purpose
Keep public and internal API contracts predictable under normal, degraded, and evolving conditions.

## Scope
Covers request/response schemas, status semantics, compatibility, limits, and failure contracts.

## MUST
- Contract changes MUST be classified for backward compatibility before release.
- Error responses MUST have stable machine-readable semantics sufficient for clients to distinguish retryable, permanent, authorization, validation, and throttling failures where relevant.
- Required fields, nullability, defaults, limits, and ordering guarantees MUST be explicit when consumers depend on them.
- Breaking contract changes MUST require migration planning, consumer impact analysis, and human approval.
- Degraded-mode responses MUST remain valid according to the documented contract or be explicitly versioned.

## MUST NOT
- MUST NOT repurpose an existing field or status code with incompatible semantics.
- MUST NOT expose implementation exceptions as an accidental public contract.
- MUST NOT assume tolerant readers make arbitrary producer changes safe.

## SHOULD
- Additive evolution SHOULD be preferred when semantics remain unambiguous.
- Contract tests SHOULD cover representative old clients and failure responses.

## Exceptions
Exceptions require affected consumers, compatibility evidence, migration path, rollback strategy, risk owner, and approval proportional to blast radius.

## Verification
Use schema diffing, consumer/provider contract tests, integration tests, compatibility review, API documentation inspection, and sampled production responses.