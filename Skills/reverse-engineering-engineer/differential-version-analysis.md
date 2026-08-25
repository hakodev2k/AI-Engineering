# Differential Version Analysis

## Purpose
Use differences between software versions to localize changed behavior, recover patch intent, and accelerate regression or vulnerability analysis.

## When to use
Use when two or more related binaries are available and the investigation concerns a change between them.

## Inputs
Versioned binaries, release notes if available, symbols, build metadata, reproducible behavior, diffing tools.

## Preconditions
Confirm binaries are comparable by platform, architecture, edition, and build configuration.

## Context to inspect
Function hashes, CFG similarity, imports, strings, constants, data layouts, compiler versions, link order, signatures, and changed resources.

## Core knowledge
Binary differences include semantic changes plus compiler/linker noise. Function movement, inlining, LTO, optimization changes, and dependency updates can create large diffs unrelated to source changes.

## Procedure
1. Establish exact identities and build metadata.
2. Normalize load addresses and obvious non-semantic metadata.
3. Match unchanged functions using symbols or structural similarity.
4. Rank unmatched/changed functions by relevance to the observed behavior.
5. Compare CFGs, calls, constants, checks, and data accesses.
6. Separate dependency/compiler churn from likely source-level changes.
7. Trace changed callers/callees to understand impact radius.
8. Validate candidate semantic differences dynamically where appropriate.
9. Record confidence and alternative explanations.

## Decision points
Use byte diffs for small deterministic builds; use structural/function similarity for optimized or relocated builds. Do not infer security significance solely from proximity to a known fix.

## Common failure patterns
Comparing different build flavors; treating every changed function as source-modified; ignoring inlining; relying on function addresses; confirmation bias from release notes.

## Verification
Demonstrate that the identified change explains a reproducible behavioral difference or has clear machine-code semantics independent of build noise.

## Expected output
A ranked, evidence-backed change map and explanation of material semantic differences.

## Stop conditions
Stop if build provenance is too different for defensible comparison or if the needed validation would exceed authorization.