# Change Planning Rules

## Purpose
Require explicit impact analysis before automation changes network state.

## Scope
Planned configuration, target sets, dependencies, maintenance windows, and execution sequencing.

## MUST
- Every production change MUST resolve its exact targets and intended deltas before execution.
- Plans MUST identify affected services, routing or forwarding dependencies, failure domains, and rollback prerequisites when relevant.
- High-blast-radius changes MUST be segmented into independently observable stages.
- Preconditions MUST be checked immediately before execution, not only when the plan was authored.
- Material plan changes after approval MUST trigger re-review.

## MUST NOT
- MUST NOT execute a production mutation from an unreviewed or stale plan when topology or state could have changed materially.
- MUST NOT hide unexpectedly broad target expansion behind aggregate counts.
- MUST NOT combine unrelated risky changes solely for operational convenience.

## SHOULD
- Plans SHOULD state expected control-plane and data-plane outcomes.
- Canary targets SHOULD represent the production risk profile without concentrating critical dependencies.

## Exceptions
Emergency changes may use an abbreviated plan only under the incident process, with explicit authority, bounded scope, and retrospective evidence capture.

## Verification
Inspect target resolution, dependency analysis, plan timestamps, approval records, precondition checks, staged rollout definition, and post-plan diff consistency.