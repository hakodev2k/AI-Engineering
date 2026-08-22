# Deployment and Rollback Rules

## Purpose
Make full-stack releases safe across coupled components and data changes.
## Scope
Builds, releases, feature flags, deployment ordering, and rollback.
## MUST
- Identify compatibility windows among frontend, backend, database, jobs, and external consumers.
- Define verification and rollback or forward-recovery steps before high-risk releases.
- Require human approval before production deployment when organizational policy or risk classification requires it.
## MUST NOT
- Deploy a breaking cross-layer sequence that requires impossible atomic timing.
- Call a release successful before critical-path verification completes.
## SHOULD
- Prefer backward-compatible staged rollout and feature flags for risky behavior.
## Exceptions
Emergency releases require authorized approval and documented post-release review.
## Verification
Review release plan, artifacts, migration order, smoke tests, telemetry, and rollback evidence.