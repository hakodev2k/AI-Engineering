# WAT and Binary Inspection

## Purpose
Inspect, disassemble, and reason about WebAssembly binaries without guessing from source code alone.

## When to use
Use for malformed modules, unexpected code generation, size regressions, import/export mismatches, linker issues, or runtime failures whose cause is unclear at source level.

## Inputs
`.wasm` artifact, optional WAT/source, compiler/linker versions, build flags, expected interface, and failure evidence.

## Context to inspect
Establish artifact provenance and checksum first. Inspect sections, custom sections, types, imports, functions, exports, code, data, names, producers, and debug metadata.

## Core knowledge
Wasm binaries are sectioned, typed modules encoded with LEB128. WAT is a readable representation but may not preserve every original binary detail. Custom sections can carry names, DWARF, producers, or tool-specific metadata. Optimization and linking can materially change source-to-binary structure.

## Procedure
1. Confirm the exact deployed artifact.
2. Validate the binary with a standards-aware tool.
3. Produce WAT/disassembly and section inventory.
4. Compare imports/exports against the expected contract.
5. Inspect type signatures and index-space references.
6. Check memories, tables, element/data segments, and start behavior.
7. Inspect custom/debug sections when provenance matters.
8. Diff against a known-good artifact when available.
9. Trace suspicious instructions back to source/build flags.
10. Record the minimal binary-level evidence for the conclusion.

## Decision points
Use source-level debugging when symbols are trustworthy; use binary-first analysis when deployment provenance, linking, or optimization is suspect. Strip metadata only after deciding its debugging and supply-chain value.

## Common failure patterns
Inspecting a locally rebuilt artifact instead of production bytes; treating WAT as perfectly reversible; ignoring import type mismatches; attributing optimizer output to runtime defects; deleting debug evidence too early.

## Verification
Revalidate the resulting binary, compare interface and section expectations, reproduce the corrected behavior, and retain artifact hashes.

## Expected output
A binary-level diagnosis with exact section/function evidence and a verified remediation.

## Stop conditions
Stop if artifact provenance cannot be established, inspection requires handling sensitive proprietary binaries outside approved tooling, or corruption prevents reliable decoding.