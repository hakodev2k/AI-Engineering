# Graceful Degradation Rules

## Purpose
Preserve essential outcomes when full functionality cannot be safely maintained.

## Scope
Applies to customer-facing services, internal platforms, data pipelines, and operational control systems.

## MUST
- Critical systems MUST identify essential versus optional capabilities for credible degraded states.
- Degraded modes MUST have explicit activation conditions, observable status, and exit criteria.
- Fallback data or behavior MUST communicate staleness or reduced guarantees when that distinction matters to correctness.
- Degradation MUST preserve security, authorization, and data-integrity boundaries.
- Recovery from degraded mode MUST be tested for backlog, cache, and state-reconciliation effects.

## MUST NOT
- MUST NOT weaken authentication, authorization, encryption, or audit requirements merely to preserve availability.
- MUST NOT silently return fabricated success when required work was not completed.
- MUST NOT allow optional features to consume resources required by critical paths during distress.

## SHOULD
- Degraded modes SHOULD be simple enough to operate during incidents and exercised before emergencies.
- User-visible degradation SHOULD be explicit when behavior or freshness materially changes.

## Exceptions
A system may fail closed instead of degrading when correctness, safety, security, or regulatory constraints dominate availability; the decision and trigger MUST be documented.

## Verification
Inject failures of optional and critical dependencies, verify essential paths remain within defined guarantees, inspect security behavior, and confirm clean restoration to normal service.