# Build Graph Design

## Purpose
Design deterministic, maintainable build dependency graphs that expose real ordering and maximize safe parallelism.

## When to use
Use when introducing a build system, decomposing a monolithic build, adding generated artifacts, or investigating excessive serialization. Do not add graph edges merely to hide flaky tasks.

## Inputs
Repository, build definitions, module boundaries, artifact relationships, CI logs, timing data, and target platforms.

## Preconditions
Understand the products that must be emitted and which source inputs own them. Preserve existing externally consumed artifacts unless a migration is approved.

## Context to inspect
Inspect workspace/module layout, target definitions, generated sources, implicit environment dependencies, test targets, packaging steps, and CI orchestration.

## Core knowledge
A build graph is a DAG of targets and declared inputs/outputs. Correct edges encode data or execution dependencies; unnecessary edges reduce concurrency. Hidden dependencies produce nondeterminism. Cycles usually indicate poor ownership or mixed responsibilities.

## Procedure
1. Enumerate final artifacts and entry targets.
2. Trace each artifact to source, generated, toolchain, and configuration inputs.
3. Model targets at stable ownership boundaries rather than arbitrary command boundaries.
4. Add edges only for genuine prerequisites.
5. Replace implicit filesystem or environment coupling with declared inputs.
6. Detect and break cycles by separating interfaces, generation, or aggregation concerns.
7. Identify targets safe for parallel execution.
8. Mark outputs and side effects explicitly.
9. Validate clean, incremental, and parallel builds.
10. Measure critical-path duration and revise graph shape where evidence supports it.

## Decision points
Use finer targets when they improve caching or parallelism without excessive scheduling overhead. Prefer coarse targets for tightly coupled operations with negligible independent reuse. Generated code should be a first-class target when consumers depend on it.

## Common failure patterns
Over-declaring dependencies, undeclared generated inputs, writing shared mutable directories, dependency cycles, ordering-only dependencies disguised as data dependencies, and graph fragmentation that costs more than it saves.

## Verification
A clean build succeeds; incremental no-op builds perform no unnecessary work; randomized/parallel execution remains correct; graph inspection shows no cycles; deleted outputs are recreated; and critical-path measurements are recorded.

## Expected output
A documented target graph with explicit dependencies, ownership boundaries, generated artifacts, and measured critical path.

## Stop conditions
Stop when required artifact ownership is ambiguous, changing graph boundaries breaks a public contract, or correctness cannot be proven without unavailable platform/toolchain access.