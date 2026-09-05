# Offline Operation Rules

## Purpose
Ensure edge AI features remain predictable when cloud connectivity is unavailable, degraded, or intermittent.

## Scope
Local inference, cached assets, synchronization, fallback behavior, and reconnect handling.

## MUST
- Required offline capabilities MUST be explicitly defined for each feature.
- Local model and configuration availability MUST be checked before an offline request is accepted.
- Reconnection and synchronization behavior MUST preserve ordering and data integrity where applicable.
- Offline errors MUST distinguish unavailable local capability from transient network failure.

## MUST NOT
- MUST NOT block a documented offline-capable feature on an unnecessary cloud dependency.
- MUST NOT silently discard locally produced state when connectivity returns.

## SHOULD
- Test extended offline periods, intermittent connectivity, and reconnect storms.

## Exceptions
Cloud-only behavior requires explicit product requirement and clear user-visible handling.

## Verification
Inspect offline integration tests, dependency maps, synchronization tests, and reconnect logs.