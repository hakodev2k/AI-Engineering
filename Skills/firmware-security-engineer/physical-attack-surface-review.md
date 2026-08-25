# Physical Attack Surface Review

## Purpose
Assess product-level physical attack paths that interact with firmware, distinguishing realistic field threats from laboratory-only techniques and selecting proportionate controls.

## When to use
Use for security architecture, pre-release hardware review, high-value devices, exposed ports/storage, tamper requirements, or physical compromise investigations.

## Inputs
Board/enclosure design, schematics, component placement, external ports, boot media, threat model, expected attacker access/time/equipment, and product value.

## Preconditions
Define physical attacker assumptions explicitly. Perform active probing only on owned/authorized lab hardware under electrical safety procedures.

## Context to inspect
Test pads, flash buses, debug pins, boot straps, removable media, reset/power lines, exposed serial ports, secure elements, shields/tamper sensors, external connectors, and RMA paths.

## Core knowledge
Physical security is layered. Obscurity and hidden pads slow attackers but do not enforce trust. Firmware should assume replaceable external storage can be copied/modified unless cryptographically protected. Tamper detection must have a defined response and false-positive policy.

## Procedure
1. Enumerate accessible surfaces from enclosure exterior through board-level access.
2. Rank attacks by required access, skill, equipment, time, and impact.
3. Trace how each physical surface can affect boot, secrets, privilege, or persistent state.
4. Ensure external code/storage authenticity is cryptographically enforced.
5. Disable/gate debug and bootloader entry mechanisms.
6. Protect high-value keys with hardware isolation appropriate to threat.
7. Add tamper evidence/detection only where response provides value.
8. Define behavior on enclosure open, sensor trigger, or repeated security faults.
9. Review RMA/service processes that intentionally bypass physical barriers.
10. Validate controls on production-equivalent hardware.
11. Document attacks intentionally out of scope.

## Decision points
Tamper-evident construction may be sufficient for moderate threats; active tamper response is justified for high-value secrets but adds reliability/safety complexity. Potting/shielding raises attack cost but complicates repair and should complement cryptographic controls.

## Common failure patterns
Hidden pads considered secure; external flash encryption without integrity; tamper sensor that only logs locally; destructive zeroization triggered by noisy sensors; RMA procedure exposing keys; threat model silently excluding inexpensive chip-off attacks.

## Verification
Inspect/probe representative units, attempt authorized access to exposed buses/interfaces, verify cryptographic protections remain decisive after enclosure compromise, test tamper response and false-trigger recovery, and review service workflows.

## Expected output
Physical attack-surface map, prioritized mitigations, hardware/firmware configuration changes, test evidence, and explicit out-of-scope attacks.

## Stop conditions
Escalate when proposed controls affect electrical/safety certification, destructive tamper responses are considered, or required invasive lab techniques exceed authorization/equipment scope.