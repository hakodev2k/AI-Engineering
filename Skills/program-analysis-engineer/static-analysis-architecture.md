# Static Analysis Architecture

## Purpose
Design static-analysis systems that are precise enough to be useful, scalable enough for real codebases, and explainable enough for developers to trust.

## When to use
Use when building linters, bug finders, security analyzers, code-intelligence engines, compiler analyses, or policy enforcement over source or intermediate representations.

## Inputs
Target languages, codebase scale, defect classes, acceptable latency, false-positive tolerance, existing parser/IR infrastructure, and integration requirements.

## Preconditions
Define the questions the analyzer must answer and the cost of false positives versus false negatives.

## Context to inspect
Parsing/front-end infrastructure, AST/IR models, type information, build graph, dependency resolution, control/data-flow support, incremental caches, CI and IDE integrations.

## Core knowledge
Static analysis trades precision, soundness, completeness, scalability, and usability. Interprocedural and path-sensitive analyses increase precision but can become expensive. Analysis contracts, abstraction boundaries, and invalidation rules must be explicit.

## Procedure
1. Define target findings and required confidence.
2. Select source-, AST-, bytecode-, or IR-level analysis.
3. Identify required semantic information.
4. Define analysis lattice/state and convergence behavior where applicable.
5. Choose intraprocedural or interprocedural scope.
6. Determine path, context, heap, and flow sensitivity requirements.
7. Design caching and invalidation.
8. Specify finding provenance and explanations.
9. Add suppression and configuration mechanisms.
10. Integrate benchmarks and regression corpora.
11. Measure precision, recall proxies, latency, and memory.

## Decision points
Prefer simpler local analyses when they solve the defect class reliably. Increase sensitivity only when measured false positives or missed defects justify the cost.

## Common failure patterns
Unbounded analysis state, unstable findings, poor source mapping, hidden assumptions, brittle build integration, and treating theoretical soundness as sufficient developer value.

## Verification
Run curated positive/negative cases, large repositories, performance benchmarks, and change-invalidation tests. Review representative findings manually.

## Expected output
An analysis architecture, precision/scalability trade-offs, integration plan, and measurable quality criteria.

## Stop conditions
Stop when required semantic inputs are unavailable, resource limits make the chosen analysis infeasible, or the defect definition is too ambiguous to verify.