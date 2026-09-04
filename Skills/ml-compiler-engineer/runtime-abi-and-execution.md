# Runtime ABI and Execution

## Purpose
Define and validate the contract between compiled artifacts and the runtime that loads, launches, synchronizes, and manages them.

## When to use
Use when changing executable formats, integrating a runtime, debugging launch failures, or evolving memory/device interfaces.

## Inputs
Compiled artifact format, runtime APIs, ABI specification, device model, metadata schema, synchronization model.

## Context to inspect
Inspect argument packing, tensor descriptors, ownership, streams/queues, error propagation, dynamic shapes, symbol resolution, versioning, and cache behavior.

## Core knowledge
Compiler/runtime boundaries are compatibility contracts. ABI changes can invalidate cached artifacts or silently corrupt execution if metadata, alignment, lifetimes, or versioning diverge.

## Procedure
1. Enumerate all runtime-visible inputs and outputs.
2. Specify binary layouts, alignment, ownership, and lifetimes.
3. Define device/stream selection and synchronization semantics.
4. Specify dynamic-shape and workspace metadata.
5. Define error and status propagation.
6. Add version/capability checks for artifacts and runtime.
7. Test serialization/deserialization and cache invalidation.
8. Exercise multi-device and async paths if supported.
9. Add compatibility tests across supported versions.
10. Trace execution from artifact load through completion.

## Decision points
Keep ABI minimal and stable when multiple compiler/runtime versions coexist; use richer metadata when dynamic execution requires it. Prefer explicit version rejection over best-effort interpretation.

## Common failure patterns
Alignment mismatches, stale cache artifacts, ownership ambiguity, missing synchronization, incompatible metadata versions, and errors swallowed across the boundary.

## Verification
Run ABI conformance tests, repeated load/execute cycles, async/device tests, cache compatibility tests, and end-to-end compiled model execution.

## Expected output
A documented runtime ABI or validated integration with compatibility, lifecycle, and execution evidence.

## Stop conditions
Stop if ownership or synchronization semantics are undefined, incompatible ABI changes lack migration/versioning, or runtime capability cannot be verified.