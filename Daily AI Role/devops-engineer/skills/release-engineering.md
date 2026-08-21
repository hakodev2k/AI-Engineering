# Skill: Release Engineering

## Purpose
Prepare and execute a traceable release with controlled risk, immutable artifacts, explicit approvals, observable rollout, and a recovery path.

## Trigger
Scheduled release, hotfix, production deployment, environment promotion, or release readiness review.

## Inputs
Release contract, artifact identifier, changeset, test evidence, target environment, change window, dependency status, rollback/recovery method, monitoring links, and approvers.

## Preconditions
Artifact is built; required evidence is available; target is identified; change ownership is clear.

## Procedure
1. Freeze the release scope and record artifact digest/version.
2. Classify release risk using impact, reversibility, data change, security surface, dependency count, and novelty.
3. Validate tests, policy gates, configuration references, and deployment prerequisites.
4. Confirm environment-specific values without rebuilding application artifacts.
5. Confirm rollback or forward-recovery path and the conditions that trigger it.
6. Collect required human approvals for configured risk classes.
7. Execute deployment using the approved artifact and target.
8. Observe technical and user-impact signals for the defined window.
9. If thresholds breach, invoke recovery workflow rather than improvising.
10. Close only when evidence, residual risk, and handoff are recorded.

## Decisions
Prefer canary/rolling strategies when blast radius can be constrained. Prefer rollback when safe and faster than diagnosis; prefer forward recovery when rollback would worsen schema/data compatibility.

## Constraints
MUST NOT deploy an unknown artifact, silently widen permissions, bypass approval policy, or label a release successful before observation completes.

## Outputs
Release record, deployment evidence, approval record, monitoring result, recovery decision if used, residual risk, and owner.

## Verification
Cross-check deployed version with approved artifact identity and target telemetry. Fresh verification is required.

## Failure handling
One controlled retry may be used only for proven transient deployment transport/control-plane failure. Otherwise classify and recover.

## Stop conditions
Stop for missing approval, mismatched artifact, unknown target, critical gate failure, unsafe migration state, or missing recovery strategy for a high-risk release.