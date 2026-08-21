# Skill: Release Readiness
Purpose: determine whether a vertical slice is safe to expose.
Trigger: pre-merge, pre-deploy, staged rollout, or hotfix release.
Inputs: change set, tests, migration, telemetry, dependencies, feature flags, rollback plan.
Procedure: verify acceptance criteria; run contract/regression/security checks; confirm schema compatibility; validate configuration and secrets references; inspect observability; assess blast radius; define rollout stages and stop thresholds; confirm rollback/roll-forward; collect required approvals.
Decision: do not release on unknown critical-path behavior, unresolved high-severity security issue, irreversible migration without approval, or absent recovery path.
Outputs: go/no-go recommendation with evidence and conditions.
Completion: owner-approved release plan plus post-release verification signals.