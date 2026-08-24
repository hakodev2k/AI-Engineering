# SSA Construction and Maintenance

## Purpose
Construct and maintain valid Static Single Assignment form for analyses and optimizations.

## When to use
Use when lowering control flow, inserting definitions, transforming CFGs, or debugging dominance/phi failures.

## Inputs
CFG, definitions/uses, dominance information, IR invariants, failing verifier output.

## Context to inspect
Dominators, dominance frontiers, block arguments/phi nodes, critical edges, unreachable blocks, exception edges, verifier rules.

## Core knowledge
SSA requires each use to be dominated by its definition, with merges represented explicitly. CFG mutations invalidate dominance and often require SSA repair.

## Procedure
1. Validate the CFG and identify variable definitions.
2. Compute or obtain dominance information.
3. Place merge definitions using the IR's phi/block-argument convention.
4. Rename values along the dominator tree.
5. Handle unreachable and exceptional control flow explicitly.
6. After CFG transforms, update or recompute analyses.
7. Run the SSA verifier.
8. Add loops, diamonds, irreducible-flow, and unreachable-code tests.

## Decision points
Use full reconstruction after broad CFG changes; incremental repair only when correctness is simpler and measurably cheaper. Split critical edges when transformations need edge-local operations.

## Common failure patterns
Stale dominators, missing loop-carried values, incorrect phi predecessor order, uses not dominated by definitions, exceptional edges ignored.

## Verification
Run dominance and SSA verifiers after each relevant pass; compile stress CFGs and compare behavior at unoptimized settings.

## Expected output
Valid SSA with explicit analysis invalidation and regression tests.

## Stop conditions
Stop if the CFG model cannot express required exceptional or indirect control flow safely.