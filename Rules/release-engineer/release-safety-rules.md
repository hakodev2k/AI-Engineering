# Release Safety Rules

## Purpose
Prevent unsafe promotion, unverifiable deployment, and unrecoverable release changes by requiring provenance, readiness evidence, bounded rollout, and tested recovery.

## Scope
Applies to build artifacts, versions, release manifests, environment promotion, deployments, database or configuration changes, emergency changes, release communications, and rollback decisions.

## MUST
- Identify the immutable artifact or source revision, version, target environment, owner, change scope, dependencies, and approval status before promotion.
- Verify the documented build, test, security, migration, configuration, and operational-readiness evidence appropriate to the release risk.
- Define success signals, observation window, rollout boundary, stop condition, rollback trigger, and rollback owner before an externally visible or production change starts.
- Preserve compatibility, ordering, and recovery requirements for schema, API, configuration, and multi-service changes.
- Record actual deployment time, operator or automation identity, observed result, exceptions, incidents, and final release disposition.
- Stop promotion and escalate when required evidence is absent, stale, contradictory, or outside the approved change boundary.

## MUST NOT
- MUST NOT promote an artifact that cannot be traced to its reviewed source and validation evidence.
- MUST NOT treat a green pipeline, a successful deploy command, or a passing health endpoint as complete verification of user-impacting behavior.
- MUST NOT expand scope, environment access, credentials, data migration, or customer impact during release without the approval required by target policy.
- MUST NOT retry a failed destructive, financial, or non-idempotent release step without understanding the resulting state and recovery path.

## SHOULD
- SHOULD use progressive rollout, canary, feature flag, or reversible configuration where the system supports it.
- SHOULD rehearse rollback and restoration paths with representative but non-production data before a high-risk release.
- SHOULD publish concise status and handoff information that distinguishes observed facts, assumptions, and pending verification.

## Exceptions
An exception requires the exact gate waived, release scope, risk, compensating controls, expiry or review time, accountable approver, rollback decision rule, and post-release follow-up. An emergency does not remove the requirement to record evidence and review the decision.

## Verification
Verify artifact provenance, target configuration, rollout signals, user-facing behavior, telemetry, alert state, data consistency where applicable, rollback readiness, and the completed release record. Close only after the observation window and required handoff are complete.
