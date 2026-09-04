# Graph Capture and Frontend Lowering

## Purpose
Build and debug reliable conversion from dynamic ML framework programs into compiler IR while preserving semantics, shape behavior, control flow, and side effects.

## When to use
Use when integrating a framework frontend, fixing graph breaks, extending operator import, or investigating mismatches between eager and compiled execution.

## Inputs
Framework program, capture mechanism, operator registry, example inputs, dynamic-shape requirements, frontend diagnostics.

## Context to inspect
Inspect tracing/scripting rules, graph-break conditions, decomposition tables, control-flow capture, mutation, aliasing, randomness, state, custom operators, and fallback behavior.

## Core knowledge
Frontend lowering must preserve observable program semantics. Tracing can specialize accidentally; dynamic Python behavior, mutation, data-dependent control flow, and side effects require explicit treatment.

## Procedure
1. Reproduce eager behavior with deterministic inputs where possible.
2. Capture the graph and record all graph breaks or fallbacks.
3. Compare captured inputs, constants, control flow, and side effects with source behavior.
4. Identify unsupported operators and choose import, decomposition, or fallback.
5. Preserve dtype, device, aliasing, mutation, and randomness semantics.
6. Handle symbolic shapes without over-specialization.
7. Add legalization from frontend ops into stable compiler IR.
8. Validate diagnostics for unsupported constructs.
9. Add eager-versus-compiled differential tests.
10. Test static, dynamic, and edge-case shapes.
11. Measure capture overhead and cache behavior.

## Decision points
Prefer decomposition when semantics can be represented efficiently by stable primitive ops; add native frontend support when decomposition loses information or performance. Use fallback only when correctness is preserved and operational cost is understood.

## Common failure patterns
Silent specialization, incorrect mutation handling, lost aliasing, unsupported data-dependent control flow, inconsistent random state, and fallback paths producing different numerics.

## Verification
Run differential correctness tests against eager execution, inspect captured graphs, test repeated runs with varied shapes, and verify expected graph-break diagnostics.

## Expected output
A validated frontend lowering path, new importer/decomposition support, or a root-cause report with reproducible evidence.

## Stop conditions
Stop when source semantics cannot be represented by the target IR, correctness depends on unsupported side effects, or fallback changes observable behavior.