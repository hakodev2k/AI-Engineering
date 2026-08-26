# Third-Party Intelligence Rules

## Purpose
Use external fraud intelligence without outsourcing accountability for correctness, privacy, or availability.

## Scope
Vendor scores, device intelligence, identity verification, consortium data, and watchlists.

## MUST
- Third-party signals MUST define semantics, permitted use, freshness, availability, and fallback behavior.
- Vendor score or version changes MUST be validated before material production reliance.
- High-impact decisions MUST account for vendor error, outage, and opaque reasoning risk.
- Sensitive data sent externally MUST be minimized and authorized.

## MUST NOT
- MUST NOT treat vendor output as ground truth without validation.
- MUST NOT create an unbounded dependency without timeout and failure handling.

## SHOULD
- Critical vendors SHOULD undergo periodic performance, security, privacy, and concentration-risk review.

## Exceptions
Require necessity, compensating controls, evidence, and approval.

## Verification
Review contracts, configuration, validation reports, outage tests, data mappings, monitoring, and fallback exercises.