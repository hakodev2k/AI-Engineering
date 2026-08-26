# Token and Cost Optimization

## Purpose
Reduce prompt and inference cost while preserving required quality, safety, and maintainability.

## When to use
Use when token spend, latency, or context limits constrain a production AI workflow.

## Inputs
Token traces, cost model, prompt/context, output lengths, cache behavior, traffic volume, and quality evals.

## Context to inspect
Measure actual input/output token distributions by task slice and identify repeated, unused, or low-value context.

## Core knowledge
Optimization is a constrained quality problem. Removing tokens can improve focus but can also remove necessary evidence. Output tokens often have different cost/latency impact from input tokens.

## Procedure
1. Establish quality and safety thresholds before optimization.
2. Profile tokens by prompt section and traffic slice.
3. Remove duplicate and obsolete instructions.
4. Replace verbose prose with precise constraints.
5. Trim irrelevant retrieved context and examples.
6. Reduce output verbosity where consumers do not need it.
7. Evaluate prompt caching or reusable prefixes when supported.
8. Consider smaller models only after task-level benchmarking.
9. Re-run full evals after each material reduction.
10. Calculate savings at realistic traffic volume.

## Decision points
Prefer retrieval quality improvements over arbitrary truncation. Keep redundancy when it demonstrably protects critical behavior. Optimize high-volume paths first.

## Common failure patterns
Minifying prompts until semantics become ambiguous; measuring only list price; removing examples without held-out tests; allowing outputs to expand after input savings; optimizing low-volume paths.

## Verification
Compare quality/safety metrics, p50/p95 tokens, latency, and projected/actual cost against baseline.

## Expected output
An optimized prompt/context configuration with quantified savings and non-regression evidence.

## Stop conditions
Stop when further savings breach quality thresholds, telemetry is unreliable, or pricing/runtime behavior is unknown.