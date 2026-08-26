# Event Time and Windowing

## Purpose
Implement correct time-based stream computations under out-of-order and late-arriving data.

## When to use
Use for aggregations, sessionization, anomaly detection, temporal joins, and event-time correctness incidents.

## Inputs
Event timestamps, lateness distribution, business window semantics, allowed correction behavior.

## Context to inspect
Timestamp source, timezone handling, watermark strategy, state retention, sink update capabilities.

## Core knowledge
Processing time reflects system execution; event time reflects business occurrence. Watermarks estimate completeness and trade latency against late-data correctness. Window choice must match business semantics.

## Procedure
1. Define authoritative event-time field and timezone.
2. Measure actual lateness and disorder.
3. Choose tumbling, sliding, session, or custom windows.
4. Define watermark/allowed-lateness policy.
5. Define late-event handling and corrections.
6. Size state retention.
7. Test boundary timestamps, disorder, clock anomalies, and very late data.
8. Monitor late-event rate and watermark delay.

## Decision points
Use event time for business chronology; processing time only when arrival time is the intended meaning. Increase lateness tolerance only when correctness value exceeds latency/state cost.

## Common failure patterns
Using ingestion time accidentally; timezone ambiguity; dropping late data silently; unbounded window state; incorrect inclusive/exclusive boundaries.

## Verification
Deterministic tests cover window edges, late events, out-of-order sequences, and replay equivalence.

## Expected output
Documented temporal semantics, window configuration, and late-data policy.

## Stop conditions
Stop if authoritative event time or acceptable correction semantics are undefined.