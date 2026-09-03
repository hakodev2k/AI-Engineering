# Model Import and Frontend Lowering

## Purpose
Convert framework or interchange-format models into compiler IR without changing model meaning. This skill covers operator mapping, constant handling, control flow, symbolic dimensions, custom operators, and frontend diagnostics.

## When to use
Use when adding support for a framework/export format, fixing import failures, supporting a new model family, or improving error messages at the compiler boundary.

## Inputs
- Source model or exported graph
- Source operator specifications
- Compiler IR contracts
- Example inputs and expected outputs
- Opset/version metadata

## Preconditions
Confirm the exact source framework/exporter version and whether the graph is training or inference oriented.

## Context to inspect
Inspect source graph nodes, attributes, constants, subgraphs, dtype rules, broadcasting, shape metadata, state, tokenizer-facing assumptions, custom ops, and current importer code.

## Core knowledge
Frontend lowering must normalize different source semantics into explicit compiler semantics. Seemingly equivalent operators can differ in padding, axis ordering, integer promotion, rounding, masking, or broadcasting. Importers should fail early and precisely on unsupported semantics rather than silently approximate behavior.

## Procedure
1. Capture a minimal failing or representative exported graph.
2. Record source opset and operator semantics.
3. Map operators to IR operations or explicit decompositions.
4. Preserve constants, symbolic dimensions, attributes, and control dependencies.
5. Validate dtype, broadcasting, padding, and indexing behavior.
6. Handle unsupported/custom operators with explicit extension points or hard failures.
7. Add importer diagnostics containing node, op, shape, and attribute context.
8. Compare imported execution against the source framework on representative inputs.
9. Add regression tests for edge cases and version differences.

## Decision points
Prefer native IR ops when semantics match exactly; use decompositions when they improve backend portability without losing information. Do not decompose an op before high-level optimizations if the original semantic unit is valuable for fusion or pattern recognition.

## Common failure patterns
- Assuming exporter output is stable across versions.
- Silent dtype or broadcasting changes.
- Dropping symbolic shape constraints.
- Mishandling negative axes, padding, masks, or integer division.
- Treating unsupported custom ops as no-ops.

## Verification
Implemented means the graph imports. Verified means outputs match a trusted framework within defined tolerances across normal, boundary, dynamic-shape, and dtype cases.

## Expected output
A reliable frontend lowering path with diagnostics, compatibility notes, and semantic regression coverage.

## Stop conditions
Stop when source semantics cannot be determined, required custom-op behavior is unavailable, or reproducing the source result requires an undocumented approximation.