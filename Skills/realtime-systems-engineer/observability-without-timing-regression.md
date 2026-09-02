# Observability Without Timing Regression

## Purpose
Instrument real-time systems so timing, failures, and resource behavior are diagnosable without letting telemetry itself violate deadlines.

## When to use
Use when adding logs, metrics, traces, flight recorders, performance counters, or incident diagnostics to deadline-sensitive code.

## Inputs
Timing budgets, current telemetry, incident needs, storage/network limits, critical paths, target hardware.

## Context to inspect
Logging calls, formatting, locks, buffers, tracepoints, sampling, exporters, timestamp sources, interrupt context, and persistence paths.

## Core knowledge
Synchronous logging, formatting, allocation, I/O, and global locks can introduce large jitter. Real-time observability favors fixed-size records, preallocated ring buffers, low-overhead tracepoints, sampling, deferred export, and explicit drop behavior.

## Procedure
1. Define diagnostic questions before adding telemetry.
2. Mark timing-critical contexts where blocking or allocation is forbidden.
3. Select minimal fixed-size events and stable identifiers.
4. Use bounded buffers with explicit overwrite/drop policy.
5. Timestamp with the correct monotonic clock.
6. Defer formatting, aggregation, and export to lower-criticality work.
7. Rate-limit noisy events and fault storms.
8. Measure instrumentation overhead and cache effects.
9. Verify telemetry remains useful during overload and crash conditions.

## Decision points
Prefer always-on low-cost event recording for critical evidence; use sampled rich telemetry where volume or overhead is too high. Persist only what incident requirements justify.

## Common failure patterns
Logging in ISRs, dynamic formatting on critical paths, unbounded queues, telemetry locks shared with functional code, and turning off diagnostics entirely to meet deadlines.

## Verification
Benchmark critical paths with telemetry disabled and enabled, stress buffer saturation, and verify bounded overhead and useful incident reconstruction.

## Expected output
An observability design with event schema, buffering, overhead budget, export path, and saturation behavior.

## Stop conditions
Stop when the proposed instrumentation consumes timing headroom without a justified diagnostic requirement or bounded alternative.