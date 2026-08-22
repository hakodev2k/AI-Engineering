# Performance-Focused Code Review

## Purpose
Review code changes for credible performance risks using workload context and complexity reasoning without promoting premature micro-optimization.

## When to use
Use for hot paths, high-volume services, data-intensive changes, concurrency changes, serialization, database access, loops over large collections, or known performance-sensitive modules.

## Inputs
Code diff, requirements, workload estimates, architecture, existing profiles, benchmarks, database/API contracts, and performance SLOs.

## Context to inspect
Inspect call frequency, input cardinality, allocations, I/O, database round trips, concurrency, caching, algorithmic complexity, serialization, logging, and dependency fan-out.

## Core knowledge
Performance review should prioritize multiplicative effects: work inside loops, N+1 I/O, unbounded collections, repeated serialization, lock scope, and algorithmic complexity. Readability and correctness remain primary unless evidence shows a hot path.

## Procedure
1. Identify changed paths and expected invocation frequency.
2. Estimate data sizes and concurrency.
3. Look for new I/O or remote calls on critical paths.
4. Check query count and data transferred.
5. Check algorithmic complexity and repeated work.
6. Inspect allocations and copies only where volume makes them material.
7. Review locks, blocking, and concurrency bounds.
8. Check caches and invalidation implications.
9. Request a benchmark when impact cannot be reasoned confidently.
10. Distinguish blocking issues from optional optimizations.

## Decision points
Require measurement for non-obvious micro-optimizations. Block changes when workload math or known patterns show material SLO/capacity risk even before production evidence exists.

## Common failure patterns
Style-driven optimization, rejecting clear code for tiny allocation savings, missing N+1 calls, ignoring unbounded growth, and accepting benchmark claims without comparable conditions.

## Verification
Performance-sensitive review findings should be backed by workload reasoning, query evidence, profile data, or reproducible benchmarks.

## Expected output
Prioritized review findings with risk, evidence, and verification requests.

## Stop conditions
Stop when workload or system context is insufficient to classify a suspected issue beyond speculation.