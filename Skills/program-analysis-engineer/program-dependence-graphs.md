# Program Dependence Graphs

## Purpose
Build program dependence graphs (PDGs) that unify data and control dependencies for slicing, impact analysis, security reasoning, and code transformation.

## When to use
Use when analyses need explicit dependency relationships beyond simple CFG reachability.

## Inputs
CFG, def-use chains, control dependence, call graph, alias information, and source mappings.

## Preconditions
CFG and data-dependence information must have defined semantics and known limitations.

## Context to inspect
Definitions, uses, branch predicates, exceptional flow, globals, heap accesses, calls, and generated code.

## Core knowledge
PDGs combine control and data dependence. Interprocedural variants require parameter, call, and summary edges. Heap and alias approximations often dominate precision.

## Procedure
1. Define node granularity.
2. Compute control dependencies from post-dominance or equivalent semantics.
3. Add data-dependence edges from reaching definitions/SSA information.
4. Model heap dependencies using the available alias analysis.
5. Add call/parameter/return relationships when interprocedural scope is required.
6. Attach source provenance to nodes and edges.
7. Deduplicate equivalent edges without losing edge type.
8. Support directional traversal queries.
9. Cache graph regions with dependency-aware invalidation.
10. Benchmark graph size and construction cost.

## Decision points
Use statement-level nodes for explainability and finer IR nodes for precise transformations. Build interprocedural edges only when downstream consumers need them.

## Common failure patterns
Conflating control and data dependence, missing exceptional dependencies, overconnecting heap accesses, and stale dependency graphs after code changes.

## Verification
Validate against hand-built dependency examples and ensure slicing/impact queries produce expected inclusions and exclusions.

## Expected output
A queryable PDG with typed edges, source mapping, and documented approximation boundaries.

## Stop conditions
Stop when source/IR mappings or dependence inputs are too incomplete to support reliable graph semantics.