# Readiness Gate Rules

## Purpose
Ensure production entry is based on explicit, reviewable evidence rather than schedule pressure or informal confidence.

## Scope
Applies to release readiness reviews and mandatory pre-production gates.

## MUST
- Readiness criteria MUST be defined before the final go/no-go decision and mapped to accountable evidence owners.
- Required testing, security, operational, migration, observability, rollback, support, and communication evidence MUST be complete for the release risk tier.
- Failed or missing mandatory gates MUST be visible and classified as blocker, approved exception, or explicitly deferred scope.
- Gate evidence MUST reference the exact release candidate or immutable artifact versions being promoted.
- A changed candidate MUST invalidate evidence affected by that change and trigger re-verification.

## MUST NOT
- A mandatory gate MUST NOT be marked complete without inspectable evidence.
- Schedule commitments, executive interest, or sunk cost MUST NOT automatically override safety-critical gates.
- Old test results MUST NOT be reused when intervening changes can invalidate them.

## SHOULD
- Gates SHOULD be automated where deterministic checks are practical.
- Human review SHOULD focus on residual risk, cross-system dependencies, and evidence that automation cannot evaluate reliably.

## Exceptions
A gate exception requires reason, impact, evidence, compensating controls, expiry or remediation plan, named risk owner, and approval at the authority level defined for that risk.

## Verification
Inspect gate status, CI results, test reports, security findings, operational checks, artifact identifiers, approvals, and exception records. Confirm all evidence corresponds to the production candidate.