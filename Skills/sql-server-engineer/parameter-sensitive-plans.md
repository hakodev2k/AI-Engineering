# Parameter-Sensitive Plan Engineering

## Purpose
Diagnose and mitigate SQL Server performance instability caused by parameter-dependent data distributions and cached plan reuse.

## When to use
Use when identical query shapes are fast for some parameters and slow for others.

## Inputs
Query text, actual plans for multiple parameter classes, Query Store history, statistics, SQL Server version and compatibility level.

## Context to inspect
Inspect parameter sniffing behavior, skew, plan cache, PSP optimization availability, recompiles, hints, dynamic SQL, and stored procedure boundaries.

## Core knowledge
Parameter sniffing is normally beneficial. Problems arise when one reusable plan cannot serve materially different cardinality classes. Remedies trade compilation cost, maintainability, and plan stability.

## Procedure
1. Prove parameter-dependent performance variance.
2. Classify representative parameter populations.
3. Capture plans and metrics for each class.
4. Identify the operator choices that become inappropriate.
5. Check whether native parameter-sensitive plan optimization applies.
6. Evaluate query restructuring, targeted recompilation, branching, hints, or dynamic SQL.
7. Test all parameter classes.
8. Monitor plan cache and Query Store after deployment.

## Decision points
Prefer native adaptive behavior when available. Use RECOMPILE for low-frequency queries with highly variable optimal plans; use branching/dynamic SQL when stable classes can be expressed clearly. Avoid blanket OPTIMIZE FOR UNKNOWN without evidence.

## Common failure patterns
Disabling sniffing globally, testing one parameter, forcing a plan that harms another class, and confusing blocking or cache warmth with parameter sensitivity.

## Verification
Verify latency, CPU, reads, memory grants, and plan choices across representative parameter distributions and concurrency.

## Expected output
A parameter-class model, selected mitigation, and evidence of stable performance.

## Stop conditions
Stop if parameter distributions or production frequency are unknown enough to make the remedy speculative.