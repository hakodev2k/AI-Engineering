# Upgrade and Compatibility
## Purpose
Upgrade mesh components without breaking traffic or policy enforcement.
## Scope
Control plane, data plane, gateways, CRDs/APIs, version skew, and deprecations.
## MUST
- Upgrade plans MUST document supported version skew and deprecated behavior.
- Production upgrades MUST be staged with health gates and rollback criteria.
- Configuration APIs MUST be checked for breaking changes before version changes.
## MUST NOT
- MUST NOT upgrade all failure domains simultaneously.
- MUST NOT remove deprecated APIs before all consumers are migrated.
- MUST NOT proceed when rollback prerequisites are unverified.
## SHOULD
- Canary control/data-plane upgrades SHOULD precede broad rollout.
## Exceptions
Emergency security upgrades require explicit risk acceptance and accelerated verification.
## Verification
Check compatibility matrices, canary telemetry, config validation, version inventory, rollback tests, and post-upgrade traffic health.