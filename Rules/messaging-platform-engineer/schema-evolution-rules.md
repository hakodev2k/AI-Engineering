# Schema Evolution Rules

## Purpose
Evolve message schemas without breaking active producers, consumers, replays, or retained historical data.

## Scope
Schema registries, serialization formats, compatibility modes, defaults, and version transitions.

## MUST
- Schema changes MUST be checked against the compatibility mode required by deployed consumers and retained data.
- New required fields MUST have a migration or default strategy that preserves compatibility.
- Consumers that may read historical messages MUST remain compatible with retained versions or use explicit migration tooling.
- Schema registration and deployment ordering MUST be defined for multi-version rollouts.

## MUST NOT
- MUST NOT delete schema versions still needed for replay or audit.
- MUST NOT rely on coordinated lockstep deployment unless the system explicitly guarantees it.
- MUST NOT change field type or semantics incompatibly under the same contract version.

## SHOULD
- Enforce compatibility in CI and registry policy.

## Exceptions
Incompatible evolution requires migration, consumer inventory, bounded rollout, rollback, and approval.

## Verification
Review registry compatibility checks, retained versions, contract tests, and rollout order.