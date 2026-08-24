# Gas Profiling and Optimization

## Purpose
Reduce transaction cost without sacrificing correctness, readability, upgrade safety, or protocol security.

## When to use
Use after functional correctness exists, when gas limits threaten usability, or before high-volume deployment.

## Inputs
Representative transactions, gas reports, compiler settings, expected call frequency, chain fee model.

## Preconditions
Critical behavior is covered by tests and performance targets are known.

## Context to inspect
Storage reads/writes, loops, calldata, memory allocation, events, external calls, deployment bytecode, optimizer settings.

## Core knowledge
Storage writes dominate many EVM costs; optimization value depends on execution frequency and chain economics. Micro-optimizations that obscure invariants can increase security risk.

## Procedure
1. Establish baseline gas for representative flows.
2. Rank expensive operations by frequency and absolute cost.
3. Reduce unnecessary storage writes and duplicate reads.
4. Bound or replace growing on-chain loops.
5. Review data packing where it materially saves slots.
6. Prefer calldata for read-only external parameters where appropriate.
7. Review event payload size and redundant state.
8. Evaluate custom errors and compiler optimizer settings.
9. Re-run correctness and invariant tests after each change.
10. Compare gas improvement against complexity cost.

## Decision points
Optimize architecture before syntax. Accept higher gas when simpler code materially reduces security or maintenance risk.

## Common failure patterns
Optimizing unmeasured paths, unsafe unchecked arithmetic, breaking storage layout, trading clarity for negligible savings, and ignoring L2 calldata economics.

## Verification
Record before/after gas measurements under identical scenarios and rerun unit, fuzz, and invariant suites.

## Expected output
Measured optimization report and changes whose benefit exceeds their complexity/risk.

## Stop conditions
Stop when further savings require weakening invariants, compatibility, or auditability.