# Rollback Strategy Rules

## Purpose
Ensure rollback is treated as a deliberate recovery option with known limits, dependencies, and verification.

## Scope
Applies to application, configuration, infrastructure, schema, model, and dependency changes implicated in incidents.

## MUST
- Evaluate rollback feasibility whenever a recent change plausibly contributed to impact.
- Confirm rollback compatibility with current data, schema, configuration, and dependent services before execution.
- Define rollback owner, expected effect, verification signal, and abort condition.
- Record cases where rollback is unsafe or impossible and the evidence supporting that conclusion.
- Validate the environment after rollback; successful command execution alone is insufficient.

## MUST NOT
- Assume rollback is safe because deployment tooling supports it.
- Roll back across irreversible data or schema changes without an approved recovery plan.
- Repeatedly roll forward and backward without preserving evidence needed to understand outcomes.

## SHOULD
- Prefer rollback over complex forward fixes when it provides faster, safer restoration and compatibility is known.
- Test rollback procedures before incidents for critical systems.

## Exceptions
A forward fix may be preferred when rollback risk exceeds mitigation risk; document the trade-off.

## Verification
Review release metadata, schema compatibility, change diffs, rollback logs, approvals, and post-rollback telemetry.