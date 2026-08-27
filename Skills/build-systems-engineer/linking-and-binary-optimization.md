# Linking and Binary Optimization

## Purpose
Engineer reliable linking and optimize link time, binary size, symbol handling, and ABI-sensitive outputs.

## When to use
Use for native builds with slow links, oversized binaries, symbol conflicts, LTO changes, or ABI problems.

## Inputs
Object files, libraries, linker maps, symbols, compiler/linker flags, ABI requirements, binary-size metrics, and startup/runtime constraints.

## Context to inspect
Inspect static/shared linkage, library order, symbol visibility, debug info, dead stripping, LTO, incremental linking, rpaths/load paths, and platform packaging.

## Core knowledge
Link-time choices affect build latency, binary size, startup, optimization, debuggability, and ABI. Whole-program optimization can improve runtime while increasing link cost and reducing incremental speed.

## Procedure
1. Capture link time, memory, size, and symbol baselines.
2. Generate linker maps or equivalent diagnostics.
3. Identify duplicate objects, oversized sections, and symbol retention causes.
4. Validate library boundaries and linkage mode.
5. Reduce unnecessary exported symbols.
6. Evaluate dead stripping and section-level GC.
7. Evaluate LTO modes using runtime and build-time evidence.
8. Separate debug symbols where platform policy permits.
9. Validate loader paths and dependency resolution.
10. Run ABI/API and runtime regression checks.

## Decision points
Choose static linkage for deployment simplicity/isolation when size duplication is acceptable; shared linkage when ABI management and reuse justify complexity. Use full LTO only when runtime gains outweigh build cost.

## Common failure patterns
Changing optimization without measuring runtime, stripping required reflection/plugin symbols, accidental duplicate libraries, ABI breaks hidden by successful linking, and nonportable loader paths.

## Verification
Compare linker maps, size, link latency, runtime benchmarks, loader behavior, symbol exports, and ABI compatibility before/after.

## Expected output
A documented linkage strategy with measured build/runtime/size trade-offs.

## Stop conditions
Stop when ABI ownership is unclear, proprietary binary consumers cannot be tested, or signing/package policies prohibit artifact changes.