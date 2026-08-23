# Hardware-Software Integration

## Purpose
Bring up new boards and hardware revisions systematically, separating electrical, configuration, firmware, and manufacturing causes.

## When to use
Use for first board bring-up, hardware revisions, prototype failures, peripheral integration, or differences between boards.

## Inputs
Schematic, PCB notes, BOM/revision, datasheets, power/clock plan, pin map, firmware, programming/debug tools, and lab instruments.

## Context to inspect
Inspect rails, reset, clocks, boot straps, SWD/JTAG, pin mux, level compatibility, peripheral wiring, pull-ups, component variants, and errata.

## Core knowledge
Bring-up should progress from foundational dependencies to complex software: power, reset, clock, debug, memory, GPIO, then peripherals. Avoid debugging application logic before platform health is proven.

## Procedure
1. Identify exact board and silicon revisions.
2. Validate rails, reset, and clock signals.
3. Establish reliable programming/debug access.
4. Run a minimal known firmware image.
5. Validate GPIO/pin mux against schematic.
6. Bring up one peripheral at a time with observable tests.
7. Compare failing and known-good boards quantitatively.
8. Record hardware workarounds and revision-specific behavior.
9. Convert bring-up checks into production/HIL tests where useful.

## Decision points
Use minimal diagnostic firmware when the application obscures hardware state. Escalate to hardware investigation when measured signals contradict software configuration.

## Common failure patterns
Assuming schematic equals assembled board, changing firmware to mask electrical faults, skipping power/clock checks, testing many peripherals simultaneously, and failing to record board revision.

## Verification
Capture measured evidence for critical rails/clocks/buses, run repeatable peripheral tests, and confirm behavior across representative boards.

## Expected output
A bring-up record with verified platform functions, unresolved hardware issues, workarounds, and revision constraints.

## Stop conditions
Stop when operating hardware could violate electrical limits or when schematic/BOM/revision information is insufficient.