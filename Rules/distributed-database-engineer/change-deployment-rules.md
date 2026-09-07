# Change and Deployment Rules

## Purpose
Reduce production risk from database configuration, topology, software, and schema changes.

## Scope
Upgrades, configuration changes, topology changes, maintenance, and rollout procedures.

## MUST
- Production changes MUST define expected impact, validation, rollback, and monitoring.
- High-risk or irreversible production changes MUST receive authorized human approval before execution.
- Changes MUST be staged or canaried where the platform and risk permit.
- Version upgrades MUST validate compatibility, rollback constraints, and mixed-version operation.

## MUST NOT
- MUST NOT combine unrelated high-risk changes into one rollout without justification.
- MUST NOT change production configuration manually without auditable change tracking.
- MUST NOT proceed when rollback assumptions are untested for material-risk changes.

## SHOULD
- Routine changes SHOULD be automated, repeatable, and peer reviewed.

## Exceptions
Emergency changes require incident authorization, minimal scope, and retrospective reconciliation with normal controls.

## Verification
Inspect change records, diffs, rollout telemetry, approval evidence, rollback tests, and post-change validation.