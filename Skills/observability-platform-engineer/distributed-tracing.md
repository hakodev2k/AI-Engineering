# Distributed Tracing

## Purpose
Design and operate distributed tracing that reveals causal request paths, latency contributors, and failure propagation across service boundaries.

## When to use
Use for cross-service latency, dependency failures, async workflows, or tracing platform design.

## Inputs
Service topology, protocols, trace samples, latency objectives, sampling budget.

## Context to inspect
Inspect propagation headers, span boundaries, async/message consumers, sampling policy, clock behavior, and trace backend limits.

## Core knowledge
Understand parent-child relationships, links, propagation, head/tail sampling, span events, exemplars, service graphs, and asynchronous causality.

## Procedure
1. Map critical synchronous and asynchronous paths.
2. Verify context propagation at every boundary.
3. Define spans around meaningful operations, not implementation noise.
4. Record bounded diagnostic attributes and errors.
5. Choose sampling based on traffic, rarity, and incident value.
6. Preserve traces for errors and high-latency outliers when feasible.
7. Correlate traces with logs and metrics.
8. Test partial failures and queue delays.
9. Measure overhead and storage cost.
10. Document known blind spots.

## Decision points
Use head sampling for simplicity and predictable load; tail sampling when rare failures/outliers must be retained. Use links for fan-out or messaging relationships that are not strict parent-child chains.

## Common failure patterns
Broken propagation, giant traces, per-item spans in loops, missing messaging links, sensitive attributes, and sampling away rare failures.

## Verification
Trace representative requests end-to-end and confirm latency decomposition, errors, async hops, and backend searchability.

## Expected output
Verified distributed traces with documented propagation and sampling policy.

## Stop conditions
Stop if required protocol boundaries cannot propagate context or sampling would violate platform capacity.