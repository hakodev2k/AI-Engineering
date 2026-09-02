# Interprocedural Analysis

## Purpose
Propagate program facts across function and method boundaries without losing essential context or exceeding practical resource limits.

## When to use
Use when defects depend on caller-callee interactions, argument/return flow, global state, callbacks, or transitive effects.

## Inputs
Call graph, function IR, analysis domain, library models, recursion behavior, and precision/performance targets.

## Preconditions
Have stable intraprocedural semantics and a call graph whose limitations are understood.

## Context to inspect
Call sites, summaries, recursion, dynamic dispatch, closures, global state, exceptions, framework callbacks, and external APIs.

## Core knowledge
Context sensitivity reduces conflation between callers but can cause state explosion. Function summaries enable reuse and incremental analysis. Recursive SCCs require fixed-point reasoning.

## Procedure
1. Define information crossing call boundaries.
2. Choose context representation.
3. Define function summaries or inline propagation.
4. Model argument, return, exception, and global-state effects.
5. Handle recursive SCCs to convergence.
6. Add conservative summaries for unknown callees.
7. Cache summaries with dependency-aware invalidation.
8. Track provenance across call chains.
9. Bound contexts where necessary.
10. Measure precision, latency, and memory.

## Decision points
Prefer summaries for scale and repeated dependencies; use deeper context sensitivity for high-value analyses where caller conflation drives false positives.

## Common failure patterns
Unsound unknown-call handling, context explosion, summary invalidation bugs, recursion non-convergence, and losing provenance across boundaries.

## Verification
Test multi-call-chain cases, recursion, overrides, and unknown libraries; compare expected propagation with traced executions on bounded examples.

## Expected output
A scalable interprocedural analysis with documented context policy, summaries, and soundness limitations.

## Stop conditions
Stop when call resolution is too incomplete for the intended claim or analysis growth exceeds agreed budgets.