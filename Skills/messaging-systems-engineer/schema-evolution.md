# Schema Evolution

## Purpose
Evolve message schemas without coordinated deployments or silent consumer breakage.

## When to use
Use before changing fields, types, semantics or serialization.

## Inputs
Current schemas, consumers, compatibility mode, retention/replay horizon and deployment constraints.

## Context to inspect
Schema registry, generated clients, old payloads, consumer versions and deprecation policy.

## Core knowledge
Compatibility depends on serialization technology and consumer assumptions. Semantic compatibility matters even when schema validation passes.

## Procedure
1. Inventory active and replayable consumers.
2. Classify proposed change.
3. Check backward/forward compatibility mechanically.
4. Prefer additive optional fields with safe defaults.
5. Stage producer/consumer rollout in compatible order.
6. Monitor adoption.
7. Remove deprecated fields only after evidence permits.

## Decision points
Create a new event/version for incompatible semantic changes rather than forcing ambiguous compatibility.

## Common failure patterns
Renaming as delete/add without migration, changing meaning in place, and ignoring retained historical messages.

## Verification
Contract-test multiple schema versions and replay representative old messages.

## Expected output
A safe schema migration and compatibility record.

## Stop conditions
Escalate if consumer inventory or replay horizon is unknown for a breaking change.