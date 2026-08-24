# Proxy Upgrades and Storage Layout

## Purpose
Plan and execute contract upgrades without corrupting storage, bypassing initialization, or introducing unsafe authority and compatibility changes.

## When to use
Use for proxy-based systems, implementation upgrades, initializer changes, or storage refactors.

## Inputs
Current implementation, proposed implementation, proxy type, storage-layout artifacts, upgrade authority, migration requirements.

## Preconditions
Upgrade mechanism and current deployed addresses are known.

## Context to inspect
Transparent/UUPS/beacon patterns, implementation slots, inheritance order, storage gaps/namespaces, initializer state, upgrade functions, rollback paths.

## Core knowledge
Proxy state lives at the proxy while logic changes. Reordering/removing variables or changing inherited layout can reinterpret live storage. Upgrade mechanisms also create governance and initialization attack surfaces.

## Procedure
1. Identify proxy pattern and authoritative implementation slot.
2. Export current and proposed storage layouts.
3. Diff slots, types, inheritance order, and namespaces.
4. Ensure existing variables retain compatible positions/types.
5. Add new state only using the pattern's safe extension rules.
6. Review initializer/reinitializer guards and execution order.
7. Verify upgrade authorization independently from business roles.
8. Test upgrade on a fork with representative live state.
9. Run old-state/new-logic regression and invariant tests.
10. Define rollback only if storage changes remain backward compatible.

## Decision points
Prefer immutable contracts when governance cannot safely support upgrades. Use migrations/new deployments when storage compatibility would be too risky.

## Common failure patterns
Reordered storage, uninitialized implementations, duplicate initialization, unsafe delegatecall assumptions, incompatible rollback, and relying on compiler names rather than slot evidence.

## Verification
Automated storage-layout diff, fork upgrade, invariant suite, and post-upgrade state reconciliation.

## Expected output
Upgrade plan, compatibility evidence, authorization checks, migration/rollback constraints, and verification results.

## Stop conditions
Do not upgrade when storage compatibility or upgrade authority cannot be proven.