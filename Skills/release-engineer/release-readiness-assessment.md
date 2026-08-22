# Release Readiness Assessment

## Purpose
Determine whether a named change can safely enter a defined environment and produce an evidence-based go, hold, or no-go recommendation.

## When to use
Use before a planned deployment, staged rollout, emergency hotfix, migration, feature enablement, or release handoff that can affect users, data, cost, security, or operations.

## Inputs
Artifact or source revision, version, environment, change scope, dependencies, test and security evidence, configuration and migration plan, approvals, rollout plan, success signals, rollback plan, owner, and target change policy.

## Procedure
1. Confirm the release scope, immutable artifact identity, source revision, target environment, accountable owner, and permitted change window.
2. Compare actual changes and dependencies with the approved scope; identify incompatible versions, required ordering, feature flags, secrets, data changes, and external provider effects.
3. Review build, test, quality, security, compatibility, migration, configuration, and operational evidence for freshness and relevance to the exact artifact.
4. Define rollout steps, audience boundary, observation window, success signals, stop conditions, rollback trigger, recovery commands, and communication owner.
5. Validate that monitoring, alerts, dashboards, logs, runbooks, access, and on-call coverage are ready for the changed behavior.
6. Check required approvals, exceptions, maintenance windows, stakeholder notifications, and customer or regulatory commitments.
7. Run harmless preflight checks and rehearse the decision path for failure, cancellation, partial completion, and rollback.
8. Produce a go, hold, or no-go recommendation with evidence, unresolved risks, and explicit conditions for proceeding.

## Decision points
Recommend **hold** when evidence is missing, stale, or contradictory but can be completed safely. Recommend **no-go** when the artifact cannot be traced, a rollback/recovery path is unsafe, the release exceeds approved scope, or a required risk owner has not accepted the residual risk. Escalate emergency changes through the target organization's emergency policy rather than bypassing documentation.

## Verification
Confirm that each readiness item is tied to the exact artifact and environment, that a rollback owner can access and execute the documented recovery, that observation signals distinguish success from partial failure, and that required approvers received the final decision.

## Expected output
A release-readiness record with go/hold/no-go decision, artifact and environment identity, evidence links, approved exceptions, rollout and rollback conditions, observation plan, accountable owners, residual risks, and next review time.

## Stop conditions
Stop when the release identity, environment, change scope, required approval, recovery path, or verification evidence cannot be established. Do not infer readiness from a schedule, a green build alone, or pressure to ship.
