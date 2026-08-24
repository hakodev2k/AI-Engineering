# Release and Production Safety Rules

## Purpose
Reduce irreversible user impact and make iOS releases observable, reversible where possible, and evidence-based.

## Scope
App Store/TestFlight releases, phased rollout, feature flags, remote configuration, migrations, and production changes.

## MUST
- Release candidates MUST be built from reviewed source and pass defined critical-path verification.
- High-risk features MUST have rollback, disablement, or containment strategy where technically possible.
- Data migrations and remote configuration changes with destructive or broad impact MUST require authorized human approval.
- Production configuration changes MUST be auditable and validated before broad rollout.
- Release health MUST be assessed using crash, error, performance, and business-critical signals appropriate to the change.

## MUST NOT
- MUST NOT ship known critical security or data-loss defects without explicit authorized risk acceptance.
- MUST NOT assume App Store rollback is instantaneous; mitigation design MUST account for distribution delay.
- MUST NOT execute destructive production actions solely on agent recommendation without human approval.

## SHOULD
- Use phased rollout and feature flags for high-blast-radius changes when they reduce risk.
- Define stop criteria before rollout.

## Exceptions
Emergency releases may compress process but require recorded rationale, approver, verification evidence, and post-release review.

## Verification
Inspect release provenance, CI gates, archive identity, rollout configuration, migration tests, approval records, and post-release health metrics.