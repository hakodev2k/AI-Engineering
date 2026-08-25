# Peripheral and Bus Security

## Purpose
Harden firmware interactions with internal/external buses and peripherals so untrusted devices, spoofed sensors, DMA-capable components, and malformed transactions cannot cross security boundaries.

## When to use
Use for I2C/SPI/UART/CAN/USB/PCIe-like interfaces, sensor/actuator integration, external flash, DMA, or board-level security review.

## Inputs
Schematics, bus topology, peripheral datasheets, driver code, DMA/IOMMU/MPU capabilities, trust model, timing requirements, and physical-access assumptions.

## Preconditions
Classify each peripheral as trusted, partially trusted, or attacker-controllable. Do not infer trust merely because a component is inside the enclosure.

## Context to inspect
Bus masters, address maps, chip-selects, interrupts, DMA descriptors, shared memory, firmware update paths, external flash, sensor commands, error recovery, hot-plug behavior, and authentication features.

## Core knowledge
Peripheral compromise can become firmware compromise through DMA, malformed descriptors, parser bugs, spoofed measurements, or unauthorized commands. Internal buses often lack native authentication. Isolation, command validation, memory protection, and freshness checks may be required.

## Procedure
1. Map buses, masters, slaves, trust levels, and security-critical data.
2. Identify which components can initiate DMA or interrupts.
3. Restrict DMA ranges using IOMMU/MPU or bounded bounce buffers where possible.
4. Validate peripheral-provided lengths, descriptors, status, and identifiers.
5. Authenticate external security-critical peripherals/messages when supported or add protocol-level protection.
6. Protect external boot/storage buses against substitution according to threat model.
7. Enforce safe actuator command ranges and state transitions.
8. Bound interrupt rates, retries, and error recovery.
9. Handle device removal/reset without stale privileged state.
10. Test spoofed devices, malformed transactions, DMA boundary attempts, bus faults, and replayed sensor/control messages.

## Decision points
Cryptographic bus authentication is justified for security-critical external components but may exceed cost/latency budgets. Physical enclosure controls may complement, not silently replace, protocol controls. Bounce buffers trade copies for stronger DMA containment.

## Common failure patterns
Trusting external flash because secure boot verifies only some regions; DMA into privileged memory; unchecked device-reported lengths; actuator commands accepted outside safe state; bus errors causing infinite reset loops; unauthenticated replaceable sensors controlling authorization decisions.

## Verification
Exercise malicious/emulated peripherals, confirm DMA isolation, fuzz driver-facing descriptors, inject bus faults, replay security-critical messages, and verify safe recovery without privilege escalation or uncontrolled actuation.

## Expected output
Bus trust map, hardened drivers/configuration, negative tests, performance impact assessment, and residual physical assumptions.

## Stop conditions
Escalate when hardware cannot isolate an attacker-controlled bus master, safety constraints conflict with security handling, or required authentication is unsupported by deployed peripherals.