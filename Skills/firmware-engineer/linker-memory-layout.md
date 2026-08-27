# Linker and Memory Layout

## Purpose
Control firmware placement and memory consumption with evidence from linker outputs.

## When to use
Use for memory pressure, startup changes, special sections, retained data or release-size investigation.

## Inputs
Linker script, map file, memory specification, build configuration and binary artifacts.

## Context to inspect
Flash/RAM regions, stack and heap policy, sections, alignment, symbols, dead stripping and generated linker settings.

## Core knowledge
Linker placement determines runtime addresses and resource usage. Section attributes and alignment can create surprising gaps or retention.

## Procedure
1. Inventory memory regions and constraints.
2. Inspect section placement and largest symbols.
3. Confirm stack/heap policy.
4. Check alignment and padding.
5. Identify duplicated or unexpectedly retained objects.
6. Modify layout only with explicit ownership.
7. Rebuild and compare map artifacts.
8. Validate runtime behavior.

## Decision points
Prefer eliminating waste before compression or risky layout tricks. Reserve memory explicitly when bootloaders, persistence or shared regions require it.

## Common failure patterns
Overlapping regions, silent stack/heap collision, uninitialized special sections, incorrect alignment and judging size only from source code.

## Verification
Compare map files, assert region bounds in CI where possible, test startup and stress memory use.

## Expected output
A justified memory layout with measured headroom.

## Stop conditions
Escalate before changing memory shared with boot, security or persistent-data contracts without authoritative specifications.