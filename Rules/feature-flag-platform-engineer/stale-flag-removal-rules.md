# Stale Flag Removal Rules

## Purpose
Prevent accumulated feature flags from increasing code complexity, operational ambiguity, and maintenance risk.

## Scope
Applies to temporary release flags, completed experiment flags, obsolete kill switches, retired targeting rules, and dead SDK references.

## MUST
- Temporary flags MUST be evaluated for removal when their declared exit condition is met.
- Removal MUST verify the intended permanent behavior before deleting flag configuration or code branches.
- Source references, dashboards, alerts, documentation, and automation tied only to the retired flag MUST be reviewed for cleanup.
- Permanent-state code MUST be simplified after a temporary flag is retired.
- Flag retirement MUST preserve required historical audit evidence.

## MUST NOT
- MUST NOT delete a flag before confirming no supported application version still depends on it.
- MUST NOT leave unreachable conditional branches after the decision has become permanent.
- MUST NOT reuse retired flag identifiers for new semantics.

## SHOULD
- Stale-flag detection SHOULD combine age, rollout state, source references, and owner metadata rather than age alone.

## Exceptions
A retired flag may remain temporarily for rollback compatibility when the supported-version window and removal date are documented.

## Verification
Use code search, supported-version inventory, flag metadata, application telemetry, cleanup diffs, and post-removal tests.