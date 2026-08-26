# Binary Size Optimization

## Purpose
Reduce Wasm download, storage, parse, compile, and deployment footprint without sacrificing required behavior or diagnosability.

## When to use
Use for browser delivery, edge distribution, cold-start constraints, or artifact-size regressions.

## Inputs
Current artifact, size budget, build pipeline, symbol/section breakdown, dependency graph, compression method, and runtime requirements.

## Context to inspect
Inspect code/data/custom sections, duplicated runtime libraries, exported symbols, dead code, debug info, LTO settings, feature choices, and compressed transfer size.

## Core knowledge
Raw `.wasm` size and transferred compressed size are different metrics. Generic/runtime libraries can dominate small programs. Dead-code elimination depends on visibility and linking. Removing metadata can harm debugging and provenance.

## Procedure
1. Record raw and compressed baseline sizes.
2. Break size down by sections/functions/dependencies.
3. Identify accidental exports and unreachable code.
4. Enable appropriate dead stripping/LTO.
5. Remove unused features/runtime libraries.
6. Evaluate size-oriented compiler optimization.
7. Treat debug/name/producers sections according to deployment policy.
8. Re-measure startup and runtime performance.
9. Validate behavior and stack traces.
10. Add artifact-size budgets to CI when justified.

## Decision points
Prefer compression for transfer savings when server/client support is reliable; reduce raw code when parse/compile/storage matters. Strip symbols only if external symbolication preserves operability.

## Common failure patterns
Optimizing raw bytes while compressed size worsens; deleting diagnostic metadata blindly; replacing maintainable code with brittle micro-optimizations; ignoring duplicated dependencies.

## Verification
Compare reproducible artifacts, compressed delivery size, startup metrics, functional tests, and debugging capability.

## Expected output
A smaller verified artifact with quantified trade-offs and an enforceable size budget.

## Stop conditions
Stop when further savings violate performance, security, licensing, or production-debugging requirements.