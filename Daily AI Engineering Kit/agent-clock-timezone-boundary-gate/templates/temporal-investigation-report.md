# Temporal Investigation Report

## Task
Describe the affected business behavior and trigger.

## Business time zone
Record the authoritative IANA/Windows identifier and source of truth.

## Facts
For each fact include repository path/line or test/log/config evidence.

## Temporal inventory
| Value | Classification | Source | Zone/offset semantics | Storage/serialization | Comparisons |
|---|---|---|---|---|---|

## Hypotheses
List unconfirmed explanations separately with confidence and a validation step.

## Boundary matrix
| Boundary | Before | Exact | After | Expected behavior | Test evidence |
|---|---|---|---|---|---|

Include DST gap/overlap only when applicable to the configured zone; include UTC/local midnight crossover and calendar rollover when relevant.

## Decisions
Record chosen semantics and evidence supporting them.

## Approval-required changes
List any schema, persisted representation, public contract, production scheduler/config, migration, infrastructure, or security-control change. Stop before execution until approved.

## Remaining risks
List concrete unresolved risks and impact.