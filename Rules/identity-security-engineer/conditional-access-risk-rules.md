# Conditional Access and Risk Rules

## Purpose
Use contextual signals to strengthen access decisions without creating undocumented bypasses or unsafe fail-open behavior.

## Scope
Applies to device, network, location, behavioral, session, identity-risk, and application-risk policy controls.

## MUST
- Every conditional-access policy MUST define target identities, resources, conditions, enforcement action, and exclusion logic.
- High-impact policy changes MUST be simulated or tested before broad enforcement.
- Exclusions MUST be explicit, minimal, owned, and periodically reviewed.
- Risk signals used for enforcement MUST have documented source, freshness, and expected failure behavior.
- Policy conflicts and unintended lockout paths MUST be evaluated before production rollout.

## MUST NOT
- Conditional access MUST NOT silently fail open for high-risk administrative access unless explicitly designed and approved.
- Broad exclusions MUST NOT be used as permanent troubleshooting shortcuts.
- Unvalidated device or location claims MUST NOT be treated as strong assurance signals.

## SHOULD
- Roll out restrictive policy changes progressively with measurable impact monitoring.
- Prefer deterministic deny or step-up behavior for clearly high-risk conditions.

## Exceptions
Exceptions require reason, scope, owner, expiry, compensating controls, and security approval.

## Verification
Inspect policy exports, simulation results, exclusion inventories, sign-in logs, lockout tests, and risk-event handling evidence.