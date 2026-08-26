# Realtime Observability Rules

## Purpose
Make session health diagnosable without compromising privacy.

## Scope
Logs, metrics, traces, RTC stats, correlation, dashboards, and alerts.

## MUST
- Signaling and media telemetry MUST be correlatable to a session using privacy-safe identifiers.
- Observability MUST cover setup success, join time, ICE/TURN outcomes, loss, jitter, RTT, bitrate, freezes, and disconnect causes where applicable.
- Metrics MUST preserve distributions needed to diagnose tail failures.
- Telemetry schemas MUST define units and semantics.

## MUST NOT
- MUST NOT log credentials, keys, raw media, or sensitive signaling payloads by default.
- MUST NOT rely on client logs as the sole production evidence.
- MUST NOT alert on high-volume symptoms without actionable thresholds.

## SHOULD
- Dashboards SHOULD support segmentation by client version, region, network, and media topology.

## Exceptions
Sensitive diagnostics require approved access, retention, and purpose limitation.

## Verification
Inspect telemetry schemas, sample sessions, dashboards, alert tests, privacy filters, and incident reconstruction exercises.