# Lifecycle Hooks
## intake
Reject requests without goal, service scope, owner or intended operational decision. Flag unclear sensitive-data handling.

## pre_design
Inventory existing signals and incident evidence. Do not create duplicate telemetry when an existing stable signal can answer the question.

## pre_implementation
Run cardinality, privacy, volume and retention review. Require approval when configured gates apply.

## pre_rollout
Validate semantic names, correlation, missing-data behavior and controlled evidence. Stop after two bounded correction attempts and escalate unresolved defects.

## post_rollout
Confirm ingestion, queryability, dashboard behavior, alert actionability and expected cost envelope.

## close
Require evidence, owner, documentation, residual risk and learning record for failures. Hooks MUST be deterministic and idempotent where possible.
