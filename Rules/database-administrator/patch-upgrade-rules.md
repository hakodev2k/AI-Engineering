# Patch and Upgrade

## Purpose
Keep database platforms supported and secure while controlling compatibility and availability risk.

## Scope
Engine patches, minor/major upgrades, drivers with database impact, extensions, and platform dependencies.

## MUST
- Patches and upgrades MUST be assessed for security relevance, compatibility, downtime, rollback, replication, backup, and extension impact.
- Major upgrades MUST be rehearsed using representative data and workload when practical.
- Upgrade plans MUST define validation and abort criteria.
- Unsupported database versions MUST have an approved remediation plan and risk owner.

## MUST NOT
- MUST NOT upgrade production first as a compatibility test.
- MUST NOT remove the last viable rollback or recovery path before validation is complete.
- MUST NOT indefinitely defer security-critical fixes without explicit risk acceptance.

## SHOULD
- Upgrade automation SHOULD be repeatable and version-controlled.
- Client compatibility SHOULD be tested across supported application versions.

## Exceptions
Emergency security patching may shorten normal testing only with explicit authorization, focused validation, and heightened monitoring.

## Verification
Inspect version inventory, support status, rehearsal evidence, compatibility tests, rollback readiness, approvals, and post-upgrade telemetry.