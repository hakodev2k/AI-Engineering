# Model and Protocol Versioning

## Purpose
Keep federated clients, models, training plans, and coordinator protocols compatible across staggered rollouts and long-lived client populations.

## When to use
Use when changing model architecture, serialization, aggregation semantics, client runtime, privacy parameters, or transport contracts.

## Inputs
Current client versions, supported model formats, protocol schema, rollout policy, backward-compatibility window, local state format, and release cadence.

## Context to inspect
Inspect how old clients discover new plans, whether local optimizer/personalization state survives upgrades, how server rejects incompatible updates, and how rollback works.

## Core knowledge
Federated fleets rarely upgrade atomically. Compatibility must be explicit across protocol, model, training-plan, local-state, and metric schemas. Silent compatibility assumptions create corrupted rounds.

## Procedure
1. Assign independent versions to protocol, model, training plan, and local state.
2. Define compatibility matrices rather than a single application version.
3. Include version identifiers in every invitation, artifact, and update.
4. Validate compatibility before local training starts.
5. Reject stale or incompatible updates deterministically.
6. Design migrations for persisted client state.
7. Maintain a bounded backward-compatibility window.
8. Test mixed-version fleets before rollout.
9. Define rollback compatibility for model and client runtime.
10. Remove deprecated paths only after telemetry shows safe adoption.

## Decision points
Prefer additive protocol evolution and capability negotiation for long-lived clients. Use hard cutovers only when security or correctness requires them and an enforced minimum version is operationally possible.

## Common failure patterns
- One version number for unrelated compatibility dimensions.
- Server accepts updates trained on the wrong model.
- Local personalization state breaks after upgrade.
- Rollback model cannot be loaded by newer clients.
- Deprecated protocol retained indefinitely.

## Verification
Run integration tests with supported mixed-version combinations, stale clients, rollback scenarios, and persisted-state migrations.

## Expected output
A versioning policy, compatibility matrix, migration rules, validation logic, deprecation plan, and rollback tests.

## Stop conditions
Stop if compatibility ownership is unclear or a planned change cannot be safely identified and rejected by incompatible peers.