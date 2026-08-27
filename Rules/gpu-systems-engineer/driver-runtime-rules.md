# Driver and Runtime Rules

## Purpose
Control operational risk introduced by GPU drivers, runtimes, firmware dependencies, and low-level libraries.

## Scope
Driver/runtime selection, upgrades, initialization, error handling, and fleet compatibility.

## MUST
- Production driver/runtime versions MUST be pinned or governed by an explicit compatibility policy.
- Upgrades MUST be validated against representative workloads and supported devices before broad rollout.
- Runtime initialization and device-discovery failures MUST produce actionable diagnostics.
- Driver-reset, device-lost, and fatal runtime errors MUST have defined service recovery behavior.
- Version metadata MUST be available in operational diagnostics.

## MUST NOT
- MUST NOT perform fleet-wide low-level stack upgrades without staged validation and rollback capability.
- MUST NOT treat a process restart as sufficient recovery when device health remains uncertain.
- MUST NOT suppress runtime error codes.

## SHOULD
- Use canary rollout for material driver/runtime changes.
- Track known incompatibilities alongside support policy.

## Exceptions
Emergency security upgrades may accelerate rollout but require explicit approval, monitoring, and rollback readiness.

## Verification
Inspect version inventory, compatibility tests, canary evidence, error paths, recovery tests, and deployment records.