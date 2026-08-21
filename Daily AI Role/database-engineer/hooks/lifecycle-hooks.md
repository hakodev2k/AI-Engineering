# Lifecycle Hooks

## intake.validate
Deterministic: reject a production-change request missing owner, engine, environment, affected objects, change type, risk, or completion criteria.

## preplan.snapshot
Record current schema/version, affected-object metadata, baseline workload window, replication/backup posture relevant to the change.

## prechange.guard
Fail closed when required approval is absent, recovery strategy is missing for high-risk work, health/lag thresholds already exceed limits, or actual state differs from planned precondition.

## poststep.verify
After each state-changing step, compare expected schema/checkpoint/invariants and health thresholds before allowing progression.

## failure.route
Classify failure as transient-known, partial/ambiguous, invariant violation, capacity/lock threshold, or approval issue. Only transient-known may enter bounded retry.

## completion.verify
Require final independent verification for high-risk work and a handoff containing evidence, remaining risks, and owner.

Hooks SHOULD be idempotent and read-only unless their contract explicitly represents the approved change itself.