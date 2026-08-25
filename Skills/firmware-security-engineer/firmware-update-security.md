# Firmware Update Security

## Purpose
Engineer authenticated, resilient firmware updates that resist tampering, rollback, partial installation, and unsafe recovery while remaining operable across a device fleet.

## When to use
Use when designing OTA/local updates, changing update formats, adding A/B slots, investigating failed upgrades, or reviewing update infrastructure.

## Inputs
Update transport, package format, bootloader behavior, signing hierarchy, version policy, flash layout, power-failure model, fleet constraints, and recovery requirements.

## Preconditions
Know the secure-boot policy and device identity/lifecycle model. Confirm signing authority and rollback requirements before implementation.

## Context to inspect
Updater privilege, manifest parser, signature scope, encryption if used, staging area, slot activation, persistent state, download resume logic, transport trust, telemetry, and server authorization.

## Core knowledge
Update authenticity is mandatory; transport TLS alone is insufficient. Signed manifests should bind payload hashes, target compatibility, version, dependencies, and security metadata. Atomicity requires explicit state transitions. Confidentiality is optional unless firmware secrecy is an asset. Rollback prevention must coexist with safe recovery.

## Procedure
1. Define attackers, assets, update channels, and acceptable outage/bricking risk.
2. Map package creation through distribution, validation, installation, activation, and rollback.
3. Authenticate manifests and all referenced payload bytes before activation.
4. Validate target hardware, partition, version, size, offsets, and dependencies.
5. Enforce anti-rollback using protected monotonic state where required.
6. Design atomic state transitions for download, verified, pending, boot-trial, accepted, and failed states.
7. Ensure interrupted writes cannot convert unverified bytes into executable firmware.
8. Limit retries and provide authenticated recovery.
9. Protect signing keys and separate build, approval, and signing responsibilities.
10. Add staged rollout, health confirmation, and failure telemetry for fleet updates.
11. Test corruption, replay, wrong-device packages, revoked keys, low power, storage exhaustion, and reset at each update phase.
12. Document key rotation, emergency release, and rollback exceptions.

## Decision points
Choose A/B slots for strong rollback availability when flash permits; use in-place updates only with proven journaling/recovery. Encrypt packages only when confidentiality matters; signatures remain necessary. Automatic rollback should revert failed new firmware but must not enable attacker-selected vulnerable versions.

## Common failure patterns
Trusting HTTPS without package signatures; unsigned manifests; validating after flashing executable state; version comparison bugs; shared fleet secrets; unbounded retry loops; unauthenticated USB recovery; incomplete power-loss testing; accepting a package for the wrong hardware revision.

## Verification
Verify valid upgrades and controlled rollback behavior, then demonstrate rejection of tampered, replayed, downgraded, cross-device, malformed, and revoked-key packages. Inject resets during every persistent-state transition and confirm a recoverable authenticated state.

## Expected output
A hardened update flow, test evidence, rollout/recovery runbook, key lifecycle requirements, and residual-risk record.

## Stop conditions
Escalate when update signing trust is undefined, boot verification conflicts with update design, safe recovery cannot be guaranteed, or a change risks irreversible fleet-wide lockout.