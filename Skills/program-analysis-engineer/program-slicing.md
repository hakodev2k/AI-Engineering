# Program Slicing

## Purpose
Reduce a program to statements relevant to a chosen value, statement, or effect so engineers can reason about impact and root cause efficiently.

## When to use
Use for debugging, security review, impact analysis, provenance, dead-code investigation, and explaining analysis findings.

## Inputs
Slicing criterion, CFG, def-use information, control dependencies, call graph, alias information, and analysis scope.

## Preconditions
Define whether a backward, forward, static, dynamic, or conditioned slice is required.

## Context to inspect
Definitions, uses, branches, calls, globals, heap locations, exceptions, and concurrency where relevant.

## Core knowledge
Backward slices answer what can influence a criterion; forward slices answer what a criterion can influence. Precision depends on dependence and alias quality. Static slices over-approximate possible executions; dynamic slices are execution-specific.

## Procedure
1. Define the slicing criterion precisely.
2. Build or reuse data dependencies.
3. Add control dependencies.
4. Traverse dependencies in the chosen direction.
5. Cross call boundaries using summaries or graph edges.
6. Incorporate heap dependencies conservatively.
7. Preserve source order and mapping.
8. Mark uncertain dependencies separately.
9. Minimize redundant nodes without changing meaning.
10. Validate the slice against the original program.

## Decision points
Use static slicing for possible-impact questions and dynamic slicing for a specific failing execution. Add path constraints only when large infeasible slices block usefulness.

## Common failure patterns
Ignoring control dependencies, weak heap modeling, dropping side effects, confusing dynamic evidence with all possible behavior, and producing slices too large to explain.

## Verification
Check known influence/non-influence examples and confirm material source statements are retained when the sliced program is reasoned about.

## Expected output
A source-mapped slice with dependency provenance and uncertainty annotations.

## Stop conditions
Stop when dependence information is too incomplete to preserve the intended semantics.