# Deployment and Rollback Rules

## Purpose
Make releases observable, reversible, and safe under partial failure.

## Scope
Applies to production deployments, rollouts, rollback procedures, and release verification.

## MUST
- Deployments MUST define success and failure criteria before rollout.
- Rollback procedures MUST account for database, schema, protocol, and persisted-state compatibility.
- Progressive rollout MUST stop automatically or manually when predefined critical signals regress.
- Post-deployment verification MUST include user-facing and dependency health signals.
- Rollback capability MUST be tested for critical services where rollback is an expected recovery mechanism.

## MUST NOT
- MUST NOT assume an old binary can safely run against a newly changed schema without compatibility evidence.
- MUST NOT continue rollout through unexplained critical telemetry regression.
- MUST NOT remove the last known-good artifact before recovery is no longer dependent on it.

## SHOULD
- Prefer backward-compatible deployment sequences.
- Keep deployment automation deterministic and auditable.

## Exceptions
Irreversible deployments require explicit approval, stronger pre-deployment evidence, and a documented forward-recovery path.

## Verification
Review pipeline history, rollout metrics, rollback tests, artifact retention, compatibility tests, and release records.