# Observability and Production Diagnostics

## Purpose
Make Wasm workloads observable enough to diagnose production behavior without exposing sensitive guest data or overwhelming the host.

## When to use
Use when operating Wasm services/plugins in production or designing telemetry before launch.

## Inputs
SLOs, runtime embedding, request model, tenant model, logging policy, metrics/tracing stack, and failure taxonomy.

## Context to inspect
Inspect host spans, guest invocation IDs, compile/instantiate metrics, traps, resource-limit events, host-call telemetry, module hashes/versions, and symbolication pipeline.

## Core knowledge
The host is usually the best observation point for lifecycle and capabilities. Guest telemetry may be optional or untrusted. Module identity must be tied to immutable artifacts. High-cardinality module/tenant labels require control.

## Procedure
1. Define operational questions and SLO indicators.
2. Attach immutable module/version identity to invocations.
3. Measure compile, instantiate, execute, host-call, and queue latency.
4. Count traps by classified cause.
5. Record memory/fuel/time limit consumption and violations.
6. Trace host calls while redacting sensitive values.
7. Correlate guest failures with host request traces.
8. Preserve symbolication metadata externally.
9. Alert on actionable symptoms, not raw event volume.
10. Test telemetry during failure and overload.

## Decision points
Prefer host-side metrics for trustworthy resource accounting; allow guest logs only with quotas and sanitization. Sample high-volume traces while retaining rare failures.

## Common failure patterns
Logging raw guest inputs/secrets; unbounded guest log volume; no module hash; treating all traps identically; metrics with tenant/module high-cardinality explosions.

## Verification
Inject known traps, timeouts, and host-call failures; confirm dashboards, traces, alerts, redaction, and symbolication produce actionable evidence.

## Expected output
A bounded telemetry design that links immutable artifacts to latency, failures, resources, and host interactions.

## Stop conditions
Stop if telemetry requires collecting prohibited data or cannot distinguish tenant/module identity safely.