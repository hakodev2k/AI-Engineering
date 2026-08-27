# Runtime Observability

## Purpose
Instrument container runtimes so lifecycle latency, failures, resource leaks, and host interactions can be diagnosed in production.

## When to use
Use when adding operations, defining SLOs, investigating incidents, or improving supportability.

## Inputs
Runtime API/state model, logging/tracing stack, metrics backend, incident examples, cardinality constraints.

## Context to inspect
Inspect existing logs, event streams, trace boundaries, metric labels, container IDs, host IDs, error taxonomy, and privacy/security constraints.

## Core knowledge
Runtime telemetry must correlate control-plane calls with host operations and workload identity. High-cardinality IDs belong in logs/traces more often than metric labels. Errors should preserve causal context without leaking secrets.

## Procedure
1. Define diagnostic questions and SLOs.
2. Establish stable operation and error taxonomy.
3. Add structured logs with container/execution correlation IDs.
4. Trace lifecycle phases and external/plugin calls.
5. Measure latency, errors, active operations, resource counts, and cleanup failures.
6. Bound metric cardinality.
7. Record kernel/runtime error context.
8. Redact sensitive bundle/env/credential data.
9. Test telemetry during overload and crashes.
10. Build incident queries/dashboards from real failure scenarios.

## Decision points
Use metrics for trends/alerts, traces for latency causality, and logs for detailed state. Sample successful high-volume traces but retain critical failures.

## Common failure patterns
Logging secrets, unbounded labels, string-only errors, missing lifecycle phase timing, telemetry disappearing during crashes, and no correlation across shim/runtime layers.

## Verification
Reproduce representative failures and prove an operator can identify affected container, phase, cause, and cleanup outcome from telemetry.

## Expected output
Actionable runtime telemetry and documented diagnostic queries.

## Stop conditions
Stop when telemetry requires exposing secrets or creates unacceptable host overhead/cardinality.