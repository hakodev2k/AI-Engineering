# Schema Evolution

## Purpose
Evolve streaming contracts without silently breaking producers, consumers, replays, or retained historical data.

## When to use
Use for every event-schema change and schema-governance review.

## Inputs
Current and proposed schemas, serialization format, registry settings, consumer inventory, retention horizon.

## Context to inspect
Compatibility mode, generated code, defaults/nullability, historical versions, deployment order, replay consumers.

## Core knowledge
Compatibility is behavioral as well as syntactic. Avro, Protobuf, and JSON Schema differ in evolution rules. Retained data means old schemas remain operationally relevant long after deployment.

## Procedure
1. Inventory active and replay consumers.
2. Classify the proposed change as additive, semantic, or breaking.
3. Check serialization-specific evolution rules.
4. Define defaults and optionality deliberately.
5. Run registry compatibility checks.
6. Test old producer/new consumer and new producer/old consumer combinations as applicable.
7. Plan deployment order.
8. Version the event only when semantics truly break.
9. Document migration and deprecation windows.

## Decision points
Prefer additive compatible evolution. Create a new event type/version when semantics change materially or compatibility would require misleading fields.

## Common failure patterns
Renaming/removing fields casually; changing units without schema changes; unsafe default values; assuming registry checks prove semantic compatibility.

## Verification
Compatibility checks pass, cross-version contract tests pass, and representative historical events deserialize and process correctly.

## Expected output
Approved schema change with compatibility evidence and rollout plan.

## Stop conditions
Stop when consumer inventory is unknown or a breaking change lacks coordinated migration approval.