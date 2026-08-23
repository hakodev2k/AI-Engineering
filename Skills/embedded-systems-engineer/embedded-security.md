# Embedded Security

## Purpose
Reduce firmware attack surface through secure boot, protected secrets, least privilege, hardened interfaces, and defensible update/debug policies.

## When to use
Use for connected devices, credential storage, firmware update, production provisioning, debug ports, threat reviews, or security incidents.

## Inputs
Threat model, MCU security features, boot/update design, interfaces, secrets, provisioning process, physical attacker assumptions, and compliance constraints.

## Context to inspect
Inspect boot chain, keys, flash protection, debug access, update verification, network/serial interfaces, parsers, privileged modes, randomness, and manufacturing flows.

## Core knowledge
Embedded attackers may have physical access. Security depends on hardware roots of trust, key lifecycle, authenticity, anti-rollback, memory protection, interface hardening, and minimizing long-lived secrets. Obfuscation is not a control.

## Procedure
1. Identify assets and attacker capabilities.
2. Map trust boundaries from manufacturing through field operation.
3. Establish authenticated boot/update chain where required.
4. Protect keys using appropriate hardware-backed facilities.
5. Disable or authenticate production debug/service interfaces.
6. Harden parsers and bounds-check untrusted input.
7. Apply least privilege/MPU isolation where feasible.
8. Define secure provisioning, rotation, revocation, and decommissioning.
9. Test failure and downgrade paths.

## Decision points
Use hardware-backed keys when compromise impact justifies it. Lock debug only after a validated manufacturing/service recovery process exists. Balance anti-rollback against emergency recovery needs.

## Common failure patterns
Hard-coded shared secrets, unsigned updates, production debug left open, predictable randomness, trusting internal buses, secrets in logs, and security controls that make field recovery impossible.

## Verification
Review binary/configuration, attempt unauthorized update/debug access, test corrupted and replayed inputs, verify key exposure boundaries, and validate production provisioning state.

## Expected output
A documented embedded security design with controls, residual risks, provisioning requirements, and test evidence.

## Stop conditions
Stop when threat assumptions, key ownership, provisioning authority, or required security approvals are unavailable.