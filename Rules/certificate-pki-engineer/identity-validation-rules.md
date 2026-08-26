# Identity Validation Rules

## Purpose
Bind certificates only to identities and identifiers that have been adequately validated.

## Scope
Subscriber enrollment, domain/service identity, organizational identity, and privileged issuance.

## MUST
- Validation MUST match the assurance level and certificate use case.
- Evidence MUST be attributable, time-bounded, and retained according to policy.
- Automated validation MUST resist replay and prove control of the requested identifier.
- High-impact enrollment exceptions MUST require independent human approval.

## MUST NOT
- MUST NOT issue based solely on unauthenticated request metadata.
- MUST NOT reuse stale validation evidence beyond its approved lifetime.
- MUST NOT let the requester approve their own privileged enrollment.

## SHOULD
- Validation SHOULD be automated where deterministic controls can preserve assurance.

## Exceptions
Exceptions require documented evidence, risk, compensating validation, expiry, and approval.

## Verification
Sample enrollment records, validate challenge freshness, review approval chains, and test bypass paths.