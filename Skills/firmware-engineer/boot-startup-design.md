# Boot and Startup Design

## Purpose
Design predictable firmware startup from reset through application-ready state.

## When to use
Use for new boards, boot failures, startup refactors or toolchain migrations.

## Inputs
Startup sources, linker configuration, reset requirements, platform documentation and initialization dependencies.

## Context to inspect
Reset entry, vector setup, memory initialization, runtime initialization, clock setup, watchdog behavior and application handoff.

## Core knowledge
Startup ordering is part of the system contract. Memory, clocks and runtime facilities are not necessarily available until explicitly initialized.

## Procedure
1. Trace execution from reset to application entry.
2. Document prerequisites for every initialization stage.
3. Minimize work before diagnostics are available.
4. Make failures observable where feasible.
5. Establish deterministic initialization ordering.
6. Validate warm, cold and abnormal reset paths.
7. Check startup time and memory assumptions.

## Decision points
Keep early startup minimal; defer nonessential initialization when boot latency, fault isolation or power constraints benefit.

## Common failure patterns
Hidden static initialization, dependency-order bugs, assuming retained memory contents, watchdog resets during long initialization and unclassified reset causes.

## Verification
Exercise supported reset modes, inspect startup timing, confirm initialized memory and validate application handoff.

## Expected output
A documented, deterministic startup sequence with verified reset behavior.

## Stop conditions
Stop when reset behavior or platform startup requirements cannot be established safely.