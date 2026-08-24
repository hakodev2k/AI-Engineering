# Control Flow Analysis

## Purpose
Model and analyze control flow correctly for optimization, diagnostics, reachability, and code generation.

## When to use
Use for CFG construction, reachability bugs, loop transforms, exception handling, or branch optimization.

## Inputs
IR, CFG, language control semantics, exception model, failing test or optimization goal.

## Context to inspect
Basic-block formation, terminators, exceptional edges, indirect branches, loop metadata, dominance/post-dominance, unreachable handling.

## Core knowledge
CFG correctness precedes optimization. Exceptional, cleanup, coroutine, and indirect edges can invalidate assumptions derived from ordinary branches.

## Procedure
1. Enumerate all control-transfer operations.
2. Build/validate successor and predecessor relations.
3. Mark entry, exits, exceptional and synthetic blocks.
4. Compute reachability and required graph analyses.
5. Detect loops and irreducible regions as needed.
6. Apply transformations with explicit CFG update rules.
7. Invalidate/recompute dependent analyses.
8. Verify block/edge consistency and semantics.

## Decision points
Prefer conservative edges when uncertainty affects correctness; refine only with proven facts. Recompute global analyses after broad changes rather than maintaining fragile incremental state.

## Common failure patterns
Ignoring exception edges, stale predecessor lists, removing apparently unreachable cleanup, incorrect fallthrough, loop metadata surviving CFG rewrites incorrectly.

## Verification
Run CFG verifier, control-heavy conformance tests, exception/coroutine tests, and before/after semantic comparison.

## Expected output
A correct CFG or analysis with documented assumptions and verification evidence.

## Stop conditions
Escalate if runtime control-transfer semantics or exception ABI are unknown.