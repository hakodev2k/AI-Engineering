# Dependency and Ordering

## Purpose
Prevent configuration changes from failing because hidden dependencies or rollout order were ignored.

## Scope
Cross-service settings, shared policies, schema dependencies, infrastructure prerequisites, and multi-stage changes.

## MUST
- Configuration dependencies that affect correctness MUST be explicit in change planning or automation.
- Multi-component changes MUST define a safe deployment order when compatibility is not symmetric.
- Consumers MUST tolerate the planned transition state or the rollout MUST prevent exposure to it.
- Removal of a dependency MUST verify that all known consumers have migrated.
- Cyclic configuration dependencies MUST be identified and broken or deliberately controlled.

## MUST NOT
- Deployment order MUST NOT rely solely on operator memory.
- A producer-side change MUST NOT assume all consumers update atomically unless the platform guarantees it.
- Shared configuration MUST NOT be deleted while active dependents remain.

## SHOULD
- Prefer backward-compatible expand-and-contract migrations.
- Represent dependencies in automation or validation where practical.

## Exceptions
Tightly coupled atomic systems may use coordinated changes when atomicity is proven and operationally supported.

## Verification
Review dependency graphs, consumer inventories, rollout plans, compatibility tests, and telemetry. Exercise mixed-version or transition-state tests to prove intermediate states remain safe.