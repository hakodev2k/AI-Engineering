# Uprobes and User-Space Instrumentation

## Purpose
Instrument user-space binaries safely with uprobes/uretprobes while accounting for ABI, symbols, optimization, and binary churn.

## When to use
Use when application signals are unavailable through stable APIs, USDT, or standard telemetry.

## Inputs
Binary/library, symbols/debug info, target versions, architecture, desired function arguments/returns.

## Context to inspect
Inspect symbol tables, PIE/ASLR, build IDs, calling convention, inlining, stripped binaries, container mounts, and process lifecycle.

## Core knowledge
Function names and offsets are implementation details. Compiler optimization can inline or transform functions; argument extraction is architecture/ABI specific.

## Procedure
1. Prefer USDT or supported application telemetry when available.
2. Identify exact binary build and symbol/offset.
3. Confirm function is present and not inlined away.
4. Map arguments using target ABI and type layout.
5. Define build-ID/version matching.
6. Attach only to intended processes/binaries.
7. Handle exec, library reload, and process churn.
8. Validate decoded values against application ground truth.
9. Add compatibility fallback or explicit unsupported state.

## Decision points
Use symbol attachment when symbols are stable; offset attachment requires stronger build identity. Avoid return probes when exceptional control flow makes semantics unreliable.

## Common failure patterns
Wrong ABI registers, attaching to mismatched library versions, stale offsets, double counting recursive calls, and ignoring process churn.

## Verification
Cross-check arguments/returns with controlled application inputs across supported builds and architectures.

## Expected output
Version-aware instrumentation with explicit binary identity and semantic validation.

## Stop conditions
Stop if binary identity cannot be established or optimized code makes required semantics unreliable.