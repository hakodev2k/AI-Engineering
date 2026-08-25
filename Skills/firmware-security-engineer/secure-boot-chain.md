# Secure Boot Chain

## Purpose
Design, review, and troubleshoot a hardware-rooted boot chain that executes only authorized firmware and preserves trust from immutable code through the operating payload.

## When to use
Use for new device boot architecture, bootloader changes, signing-key rotation, anti-rollback work, or investigation of boot-integrity failures. Do not treat secure boot as a substitute for runtime isolation or update security.

## Inputs
Hardware security capabilities, boot ROM behavior, boot stages, image formats, key hierarchy, signing process, rollback policy, recovery path, threat model, and failure logs.

## Preconditions
Confirm device lifecycle states, supported cryptography, immutable trust anchors, debug-state behavior, and who controls signing keys. Obtain approval before changing production trust roots.

## Context to inspect
Trace every executable boot stage, verification boundary, key source, metadata parser, recovery route, fallback slot, debug bypass, and version check. Inspect build/signing provenance and manufacturing enrollment.

## Core knowledge
A secure boot chain depends on an immutable or strongly protected root of trust, authenticated transitions between stages, strict parsing, domain-separated keys, anti-rollback state, and fail-secure recovery. Verification must cover both code and security-relevant metadata. Availability requirements may justify redundant images, but fallback must not permit downgrade.

## Procedure
1. Define protected assets and boot-time attacker capabilities.
2. Diagram the chain of trust from reset vector to final payload.
3. Identify the root key/hash and how it is provisioned and revoked.
4. Verify each stage authenticates the complete next-stage image before execution.
5. Validate algorithm, key size, signature format, certificate constraints, and parser bounds.
6. Bind security-critical metadata such as version, device class, and load address into authenticated data.
7. Implement monotonic anti-rollback checks using protected state.
8. Ensure alternate slots and recovery images obey equivalent verification rules.
9. Define behavior for invalid signatures, corrupted metadata, exhausted rollback counters, and power loss.
10. Remove or lifecycle-gate development bypasses and unsigned boot paths.
11. Add negative tests for tampered image, metadata, version, key, and slot selection.
12. Exercise key rotation and recovery on representative hardware.
13. Record trust assumptions and operational key dependencies.

## Decision points
Use certificate chains when delegated signing and rotation justify their parser and PKI complexity; use pinned public-key hashes for simpler constrained products. Prefer hardware monotonic counters where available; carefully designed protected flash state may be acceptable when endurance and fault resistance are proven. Recovery may be network, removable-media, or factory based, but it must preserve authentication.

## Common failure patterns
Authenticating code but not headers; accepting unsigned recovery; rollback through an old valid image; shared development/production keys; signature checks after execution begins; parser integer overflows; key revocation with no recovery plan; debug mode silently disabling verification.

## Verification
Implementation is complete only after the chain is instrumented and tests exist. Verification requires successful authorized boot plus demonstrated rejection of modified images, metadata, revoked keys, downgraded versions, invalid slots, and interrupted updates on real hardware or an equivalent fault-capable test rig.

## Expected output
A reviewed boot trust model, implementation/configuration changes, negative-test evidence, key/rollback operational requirements, and documented residual risks.

## Stop conditions
Stop and escalate if immutable trust anchors are unknown, production signing authority is unavailable, rollback state cannot be protected, required recovery would bypass authentication, or a trust-root change could irreversibly brick deployed devices.