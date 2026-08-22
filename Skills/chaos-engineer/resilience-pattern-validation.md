# Resilience Pattern Validation

## Purpose
Verify that timeouts, circuit breakers, bulkheads, rate limits, fallbacks, load shedding, and isolation controls behave correctly under failure.

## When to use
Use after implementing resilience controls or when production incidents suggest they interact poorly.

## Inputs
Resilience configuration, call graph, capacity limits, SLOs, and failure scenarios.

## Context to inspect
Inspect policy ordering, timeout hierarchy, retry budgets, circuit thresholds, isolation pools, fallback semantics, and telemetry.

## Core knowledge
Resilience patterns can amplify failure when misconfigured. Their composition matters as much as individual settings.

## Procedure
1. Map resilience controls along the critical path.
2. Define intended behavior for a bounded failure.
3. Inject latency, errors, or saturation.
4. Observe which control activates first.
5. Measure rejected work, retries, queueing, and downstream load.
6. Verify fallback correctness and recovery behavior.
7. Tune configuration based on measured budgets.

## Decision points
Use circuit breaking when continued calls are harmful; bulkheads when failure isolation is needed; load shedding when capacity protection outweighs accepting all work; fallbacks only when degraded results remain safe and truthful.

## Common failure patterns
Timeouts longer than caller deadlines, circuit breakers hiding systemic failures, shared pools defeating bulkheads, unsafe fallback, and rate limits without priority.

## Verification
Confirm controls activate at intended thresholds, bound resource use, preserve critical traffic, and recover without oscillation.

## Expected output
Evidence-backed resilience configuration and identified interaction risks.

## Stop conditions
Stop when controls create broader degradation or correctness risk than the injected fault.