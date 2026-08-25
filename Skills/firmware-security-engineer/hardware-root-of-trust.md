# Hardware Root of Trust

## Purpose
Select and integrate hardware trust primitives so firmware can anchor identity, boot integrity, secrets, attestation, and lifecycle controls in mechanisms stronger than ordinary software storage.

## When to use
Use for secure-element/TPM/TEE integration, MCU security configuration, device identity design, key storage, attestation, or security architecture review.

## Inputs
SoC/MCU security manual, fuses/OTP, secure element or TPM capabilities, boot ROM, privilege model, lifecycle states, manufacturing process, cryptographic requirements, and threat model.

## Preconditions
Use authoritative silicon documentation and errata. Confirm irreversible operations and laboratory recovery procedures before programming fuses or lifecycle bits.

## Context to inspect
Root keys, OTP/fuses, secure storage, isolated execution, entropy sources, monotonic counters, debug locks, measured boot registers, device identity, provisioning interfaces, and physical attack assumptions.

## Core knowledge
Hardware roots reduce dependence on mutable firmware but are not automatically secure. Trust depends on provisioning, lifecycle transitions, API boundaries, entropy, key usage policy, side-channel/fault assumptions, and recovery. Irreversible configuration demands staged validation.

## Procedure
1. Define which properties require hardware enforcement.
2. Inventory available primitives and silicon limitations/errata.
3. Map each asset to a minimal hardware mechanism and software interface.
4. Design unique device identity and key derivation without exporting root secrets.
5. Define lifecycle states for manufacturing, development, field operation, RMA, and decommissioning.
6. Restrict privileged security operations by state and caller.
7. Configure secure storage, counters, debug controls, and boot roots with least privilege.
8. Validate entropy and key generation sources.
9. Prototype irreversible settings on sacrificial hardware.
10. Define provisioning evidence and audit records.
11. Test fault, reset, invalid-state, and unauthorized-command behavior.
12. Document assumptions that remain outside hardware enforcement.

## Decision points
Use a discrete secure element when physical isolation and certified key protection justify BOM/latency complexity; use integrated security blocks when platform integration and cost dominate. Device-unique asymmetric identity is often preferable to shared secrets for fleet compromise containment.

## Common failure patterns
Treating a TEE as an absolute boundary; exporting root keys; identical secrets across devices; enabling security features without lifecycle planning; weak manufacturing authentication; undocumented fuse polarity; relying on undocumented silicon behavior; disabling recovery before validating production images.

## Verification
Read back permitted configuration, exercise authorized and unauthorized operations in every lifecycle state, validate device uniqueness, prove root secrets cannot be retrieved through supported APIs, and test recovery/RMA policy on representative units.

## Expected output
A hardware trust architecture, provisioning/lifecycle procedure, configuration changes, validation evidence, and explicit residual physical-attack assumptions.

## Stop conditions
Stop before irreversible programming when documentation is ambiguous, silicon errata affects the design, provisioning ownership is unclear, or recovery has not been tested.