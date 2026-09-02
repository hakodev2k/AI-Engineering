# Control Flow Analysis

## Purpose
Build and reason about control-flow graphs (CFGs) that accurately represent executable paths for downstream analyses.

## When to use
Use for reachability, dead-code detection, data-flow analysis, taint tracking, symbolic execution, optimization, and bug finding.

## Inputs
AST or IR, language semantics, exception model, async/coroutine behavior, and target analysis requirements.

## Preconditions
Know how the language models branches, exceptions, short-circuiting, returns, callbacks, and non-local control transfer.

## Context to inspect
IR structure, basic-block boundaries, exceptional edges, implicit control flow, call sites, coroutine lowering, and compiler-generated nodes.

## Core knowledge
A CFG is only useful if its edge semantics match reality. Missing exceptional or implicit edges creates unsound reachability; excessive conservative edges can destroy precision. Dominators, post-dominators, loops, strongly connected components, and reachability are foundational.

## Procedure
1. Define CFG node and edge semantics.
2. Partition executable statements into basic blocks.
3. Add conditional, fallthrough, loop, return, and exceptional edges.
4. Model language-specific implicit control transfers.
5. Mark entry, normal exit, and exceptional exit nodes.
6. Compute dominators and loop structure when required.
7. Validate unreachable and cyclic regions.
8. Expose stable source mappings.
9. Add regression cases for unusual constructs.
10. Benchmark graph construction on large functions.

## Decision points
Use explicit exceptional edges when downstream correctness depends on exceptions; omit them only when the analysis contract explicitly ignores exceptional behavior.

## Common failure patterns
Missing finally/defer semantics, incorrect short-circuit edges, collapsing async state transitions incorrectly, and treating syntactic structure as executable control flow.

## Verification
Compare CFGs against hand-derived graphs, execute representative programs, and test downstream reachability expectations.

## Expected output
A validated CFG with documented edge semantics and source mappings.

## Stop conditions
Stop when language semantics are unresolved or lowering obscures behavior without a trustworthy mapping.