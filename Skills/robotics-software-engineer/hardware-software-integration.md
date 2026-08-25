# Hardware-Software Integration

## Purpose
Commission robotics hardware systematically across power, buses, firmware, drivers, timing, and software interfaces while preserving safe rollback paths.

## When to use
Use during bring-up, hardware revisions, new device integration, intermittent communication faults, or field commissioning.

## Inputs
- Electrical and interface documentation
- Firmware versions
- Bus topology
- Driver source/configuration
- Device logs
- Safety limits

## Preconditions
Safe power-up procedures and emergency-stop mechanisms must be available before active testing.

## Context to inspect
Inspect CAN/EtherCAT/serial/Ethernet configuration, device IDs, firmware compatibility, kernel drivers, udev rules, permissions, power sequencing, and fault logs.

## Core knowledge
Understand fieldbuses, serial/Ethernet transport, firmware compatibility, clocking, device enumeration, electrical versus software failure signatures, power sequencing, and safe commissioning.

## Procedure
1. Review hardware revision and interface specifications.
2. Verify power, grounding, and physical connectivity.
3. Inventory devices and firmware versions.
4. Bring up one subsystem at a time.
5. Validate raw communication before high-level drivers.
6. Confirm IDs, rates, units, limits, and watchdogs.
7. Record baseline bus error and latency metrics.
8. Enable actuator outputs only after passive checks pass.
9. Test disconnect, reboot, brownout, and bus-recovery behavior.
10. Freeze known-good firmware/configuration versions.
11. Document commissioning and rollback steps.

## Decision points
Separate hardware and software hypotheses using raw bus tools and independent diagnostics. Upgrade firmware only when compatibility or defects justify it; field stability may outweigh feature freshness.

## Common failure patterns
- Debugging application code before verifying physical transport
- Mixed firmware versions with undocumented behavior
- Duplicate bus IDs
- Power issues misdiagnosed as software races
- Unsafe automatic device reset loops

## Verification
Verify device inventory, firmware, bus health, command/feedback paths, restart recovery, fault handling, and repeatable commissioning from a clean state.

## Expected output
A reproducible hardware bring-up procedure with validated interfaces, version matrix, diagnostics, and recovery behavior.

## Stop conditions
Stop for suspected electrical damage, unsafe power behavior, unknown actuator limits, unsupported firmware combinations, or tests that require bypassing safety interlocks.