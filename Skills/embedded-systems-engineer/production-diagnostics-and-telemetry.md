# Production Diagnostics and Telemetry

## Purpose
Design low-overhead diagnostics that make field failures actionable despite limited bandwidth, storage, and observability.

## When to use
Use for deployed devices, intermittent failures, fleet support, reliability analysis, or before reducing physical debug access.

## Inputs
Failure modes, communication/storage limits, privacy/security requirements, reset behavior, fleet operations, and support workflows.

## Context to inspect
Inspect logs, counters, reset causes, crash records, firmware/hardware IDs, health metrics, event storage, upload paths, and rate limits.

## Core knowledge
Embedded telemetry must be bounded and resilient. High-value structured counters/state snapshots often outperform verbose logs. Diagnostics should survive relevant resets without wearing flash or leaking secrets.

## Procedure
1. Identify field questions support must answer.
2. Define stable device/firmware/hardware identity fields.
3. Add counters for resets, communication errors, overruns, watchdogs, and critical state transitions.
4. Capture bounded crash context.
5. Rate-limit and size logs/events.
6. Persist only information worth flash/endurance cost.
7. Protect sensitive data and authenticate remote retrieval.
8. Define upload/retrieval behavior during degraded connectivity.
9. Validate diagnostics by injecting representative faults.

## Decision points
Prefer counters and compact structured events over continuous text logs. Persist only events needed across reset. Remote telemetry should not compromise real-time behavior or battery budget.

## Common failure patterns
Unbounded logging, secrets/PII in logs, timestamps without clock-quality context, no firmware revision, flash wear from logging, diagnostics disabled in release builds, and telemetry causing timing faults.

## Verification
Inject faults and confirm the resulting evidence supports diagnosis; measure CPU, memory, flash, bandwidth, and power overhead.

## Expected output
A bounded diagnostic schema and retrieval path with proven value for field root-cause analysis.

## Stop conditions
Stop when privacy/security policy, storage endurance, or operational retrieval ownership is unresolved.