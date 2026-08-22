# Workflow: Release
Trigger: a reviewed change is ready for deployment.
Goal: expose change with controlled blast radius and verifiable outcomes.
Inputs: artifact/version, test evidence, migration state, config, feature flags, SLOs, rollback plan.
Stages: verify immutable artifact and environment config; confirm dependency readiness; run preflight; obtain approvals; deploy to smallest representative scope; check health/error/latency/business signals; expand gradually; stop/rollback on thresholds; close with release evidence.
Human gates: production deployment where policy requires it, destructive migration, permission/security change, or explicit risk acceptance.
Retries: deployment retry only for diagnosed transient failures; max two before escalation.
Outputs: release record, observed metrics, rollback/mitigation result if used.
DoD: intended version active, post-release signals healthy for defined window, no unresolved blocker, ownership transferred to normal operations.