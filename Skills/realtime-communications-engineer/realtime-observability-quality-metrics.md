# Realtime Observability and Quality Metrics

## Purpose
Build observability that connects signaling, transport, media quality, infrastructure, and user experience.

## When to use
Use when defining RTC dashboards/SLOs, diagnosing blind spots, or validating releases.

## Inputs
Client RTC stats, signaling events, SFU/TURN metrics, traces, logs, session identifiers, product quality signals, and privacy requirements.

## Core knowledge
A successful connection is not necessarily a good call. Useful RTC observability correlates setup success/time, ICE path, RTT, jitter, loss, bitrate, frame rate, freezes, concealment, audio levels, layer changes, reconnects, and server health. High-cardinality identifiers require deliberate telemetry design.

## Procedure
1. Define user-visible quality and reliability objectives.
2. Establish a consistent session/participant/stream correlation model.
3. Instrument signaling state transitions and timing.
4. Collect normalized transport and media statistics at bounded intervals.
5. Instrument TURN/SFU resource and error metrics.
6. Derive actionable indicators and cohort dimensions.
7. Add privacy-aware sampling and retention.
8. Build dashboards for setup, quality, and infrastructure.
9. Create alerts on symptoms tied to user impact.
10. Validate telemetry during controlled failures.

## Decision points
Prefer aggregate metrics for alerting and sampled detailed traces for diagnosis. Avoid labels that create uncontrolled cardinality. Use quality scores only if their assumptions are understood and raw supporting metrics remain available.

## Common failure patterns
Only server metrics; no cross-layer correlation; alerting on averages; missing percentile/tail behavior; excessive telemetry volume; sensitive identifiers in logs; dashboards with no operational action.

## Verification
Inject known setup, loss, CPU, and relay failures and confirm signals identify affected cohorts and stages within the expected detection window.

## Expected output
An RTC telemetry schema, SLO indicators, dashboards/alerts, and validated diagnostic coverage.

## Stop conditions
Escalate when telemetry requires collection of sensitive media or identifiers outside approved privacy policy.