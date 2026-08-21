# Lifecycle Hooks

Hooks describe deterministic checkpoints; adapt them to the host tool without changing core role rules.

## `before-task`
- Validate task/release contract fields.
- Resolve target repository/environment.
- Classify priority and risk.
- Refuse destructive production work lacking approval context.

## `after-plan`
- Check each mutable surface has one owner.
- Check dependencies and safe parallel steps are explicit.
- Check verification and recovery are defined.

## `before-write`
- Confirm target identity and freshness.
- Re-read shared state if concurrent work is possible.
- Confirm secret values are not present in generated content/log commands.

## `after-write`
- Re-read changed state from source of truth.
- Run focused deterministic validation.
- Record evidence.

## `before-production-deploy`
- Compare approved and actual artifact identity.
- Check required approvals and quality gates.
- Record current target version and recovery checkpoint.

## `after-production-deploy`
- Verify deployed artifact identity.
- Observe configured telemetry window.
- Invoke recovery workflow on threshold breach.

## `on-failure`
- Classify before retry.
- Preserve evidence.
- Increment bounded attempt counter.
- Escalate when stop condition or retry limit is reached.

## Idempotency
Hooks should be read-only where possible. Write hooks must use unique release/task IDs or compare-and-set semantics to avoid duplicate side effects.