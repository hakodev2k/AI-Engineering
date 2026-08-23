# MCU Startup and Linker Control

## Purpose
Safely reason about reset-to-main startup, memory placement, initialization, linker scripts, sections, stacks, heaps, and special memory regions.

## When to use
Use for new targets, boot failures, memory overflows, custom sections, DMA buffers, retained RAM, bootloaders, or unexplained startup faults.

## Inputs
Linker script, startup assembly/C, map file, MCU memory map, compiler flags, bootloader contract, and crash evidence.

## Context to inspect
Inspect vector table placement, reset handler, stack pointer setup, .data copy, .bss zeroing, constructors, heap/stack definitions, alignment, and reserved regions.

## Core knowledge
The linker defines the physical realization of firmware. Incorrect placement can compile successfully yet fail at reset or corrupt data. Understand VMA/LMA, section alignment, zero/copy tables, vector relocation, no-init memory, and map-file evidence.

## Procedure
1. Read the device memory map and boot entry contract.
2. Trace reset through runtime initialization to application entry.
3. Review linker MEMORY and SECTIONS definitions.
4. Compare produced map addresses with hardware constraints.
5. Check stack, heap, vectors, DMA, retained, and boot metadata regions.
6. Validate alignment and overlap constraints.
7. Measure flash/RAM headroom.
8. Test cold boot, warm reset, and bootloader handoff when applicable.

## Decision points
Use custom sections only for explicit hardware, persistence, boot, or performance requirements. Reserve memory rather than relying on incidental placement.

## Common failure patterns
Stack collisions, forgotten NOLOAD semantics, wrong vector address, bootloader/application overlap, constructors not run, uninitialized retained data assumptions, and debugging only the source rather than the map.

## Verification
Inspect the final map/ELF, verify symbols and section addresses, boot real hardware through relevant reset paths, and test boundary-size builds.

## Expected output
Verified startup/linker configuration with documented special regions and measurable memory headroom.

## Stop conditions
Stop before changing boot-critical layout when the bootloader contract, production flashing layout, or security configuration is unknown.