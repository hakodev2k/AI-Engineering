# Purpose Limitation and Consent Rules

## Purpose
Prevent personal data from being reused outside approved purposes or consent boundaries.

## Scope
Applies to collection, secondary use, analytics, personalization, experimentation, sharing, and downstream processing.

## MUST
- Each processing path MUST map data use to an approved purpose and applicable consent or policy condition.
- Consent-dependent processing MUST verify current consent state before execution where technically feasible.
- Revocation MUST propagate to affected processing paths within the required operational window.
- Secondary uses MUST be reviewed for compatibility with the original purpose before implementation.

## MUST NOT
- Consent MUST NOT be assumed from inactivity, unrelated acceptance, or technical possession of data.
- Data collected for one purpose MUST NOT be silently reused for materially different purposes.
- Revoked users MUST NOT remain in new processing batches because of stale cached eligibility.

## SHOULD
- Purpose and consent state SHOULD be represented as explicit machine-readable attributes where practical.
- Systems SHOULD fail closed for high-risk consent-dependent processing when consent state is unavailable.

## Exceptions
Exceptions require documented legal or policy basis, necessity, scope, risk controls, and accountable approval.

## Verification
Inspect consent records, policy mappings, processing code, batch eligibility logic, revocation tests, cache behavior, and audit trails. Verify purpose and consent checks at each relevant boundary.