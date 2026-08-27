# Wait Statistics Analysis

## Purpose
Use SQL Server waits to classify where workload time is spent and direct investigation toward evidence-backed bottlenecks.

## When to use
Use for instance-wide slowdowns, throughput loss, latency spikes, or capacity investigations.

## Inputs
Wait statistics deltas, active waits, workload timeline, CPU, I/O, memory, and query telemetry.

## Context to inspect
Inspect interval deltas rather than lifetime totals, benign/background waits, resource metrics, Query Store waits, and top queries.

## Core knowledge
Waits are symptoms and queueing signals, not diagnoses. Interpretation requires workload context and correlation with resource saturation.

## Procedure
1. Define a meaningful observation interval.
2. Capture wait deltas and workload volume.
3. Exclude known benign background waits.
4. Group remaining waits by CPU, I/O, locking, memory, network, parallelism, or external causes.
5. Correlate with host/storage/database metrics.
6. Identify responsible queries or sessions.
7. Form and test a causal hypothesis.
8. Re-measure after change.

## Decision points
Prioritize waits that are both material and correlated with user-visible impact. Do not optimize a high cumulative wait that is normal for the workload.

## Common failure patterns
Reading lifetime waits, treating CX waits as inherently bad, clearing waits without preserving baseline, and tuning configuration before locating workload causes.

## Verification
Confirm the targeted wait and user-facing latency/throughput improve together under comparable workload.

## Expected output
A ranked wait profile, causal hypothesis, affected workload, and verified remediation.

## Stop conditions
Stop when workload volume differs too much between comparison windows to support a valid conclusion.