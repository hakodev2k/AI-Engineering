# Schema Governance and Evolution

## Purpose
Govern message contracts so producers and consumers can evolve independently without silent data corruption or broad release coordination.

## When to use
Use for Avro, Protobuf, JSON Schema, or custom contracts shared through brokers.

## Inputs
- Existing schemas and versions
- Producer and consumer ownership
- Compatibility requirements
- Registry capabilities

## Context to inspect
Inspect registry policies, generated clients, consumer lag in versions, optional/default fields, and historical payloads.

## Core knowledge
Understand backward, forward, and full compatibility; schema IDs; semantic versus syntactic compatibility; field defaults; enum evolution; and contract ownership.

## Procedure
1. Identify contract owner and consumers.
2. Select a compatibility policy based on deployment independence.
3. Define required, optional, default, and deprecated fields deliberately.
4. Validate schema changes in CI against registered history.
5. Separate breaking semantic changes into new versions or destinations when necessary.
6. Preserve old readers during migration windows.
7. Record deprecation and removal dates.
8. Monitor use of obsolete versions.

## Decision points
Prefer additive compatible evolution for long-lived streams. Introduce a new contract when semantics change enough that compatibility would be misleading.

## Common failure patterns
- Treating schema validation as semantic compatibility
- Renaming fields without migration planning
- Reusing enum values with new meaning
- Removing fields while old consumers remain
- Registry bypass through ad hoc payloads

## Verification
Run compatibility checks, deserialize historical payloads with new readers and new payloads with supported old readers, and verify consumer integration tests.

## Expected output
A governed contract with compatibility mode, ownership, migration rules, and verified evolution behavior.

## Stop conditions
Stop if compatibility requirements are unknown, registry history is incomplete, or a change would strand unmanaged consumers.