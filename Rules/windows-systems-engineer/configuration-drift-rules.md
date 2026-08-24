# Configuration and Drift

## Purpose
Keep Windows system state intentional, reproducible, and explainable.

## Scope
OS configuration, registry, roles/features, local policy, installed software, services, and managed baselines.

## MUST
- Critical configuration MUST have an authoritative source or documented intended state.
- Drift detection MUST distinguish approved exceptions from unauthorized or unexplained changes.
- Material manual production changes MUST be captured back into the authoritative configuration process where applicable.
- Baseline changes MUST be reviewed and tested before broad enforcement.

## MUST NOT
- MUST NOT normalize unexplained drift by simply updating the baseline to match it.
- MUST NOT rely on undocumented one-off manual settings for critical service operation.
- MUST NOT auto-remediate destructive or availability-sensitive drift without bounded safeguards and authorization.

## SHOULD
- Prefer declarative, idempotent configuration mechanisms.
- Track provenance and timestamps for configuration changes.

## Exceptions
Require reason, owner, expiration/review date, risk, and reconciliation plan.

## Verification
Compare desired and effective state, inspect configuration history, validate exception records, run representative compliance checks, and confirm remediation does not break service.