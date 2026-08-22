# Production Validation Rules

## Purpose
Validate production behavior safely when pre-production evidence is insufficient.
## Scope
Smoke checks, post-deployment verification, monitoring-assisted validation, and incident confirmation.
## MUST
- Use non-destructive checks by default and define expected impact before production testing.
- Obtain explicit approval for tests that create data, traffic, side effects, or elevated access beyond routine authorized checks.
- Correlate production conclusions with telemetry and deployment context.
## MUST NOT
- Use destructive test data cleanup, privileged mutation, or load generation without explicit authorization.
- Expose customer data while collecting evidence.
## SHOULD
- Prefer synthetic accounts, feature-scoped checks, canaries, and reversible actions.
## Exceptions
Incident response may use broader validation only under incident authority and documented safeguards.
## Verification
Inspect approvals, executed checks, telemetry, side effects, cleanup, and incident/deployment records.