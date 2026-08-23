# Frontend Observability

## Purpose
Make real-user frontend failures and performance problems diagnosable through structured errors, traces, performance signals, release metadata, and privacy-aware context.

## When to use
Use when instrumenting production applications, diagnosing user-only failures, measuring performance, or improving incident response.

## Inputs
Telemetry platform, privacy policy, release process, critical journeys, performance targets, backend tracing model, and incident history.

## Context to inspect
Error capture, source maps, release/version tags, route/user-session dimensions, web vitals, distributed trace headers, sampling, and data scrubbing.

## Core knowledge
Client telemetry must connect symptoms to release, route, browser, and request context without collecting unnecessary personal data. Source maps and release identity are required for actionable stack traces. Sampling must preserve important failures.

## Procedure
1. Define questions observability must answer for critical journeys.
2. Attach stable release/version metadata.
3. Capture unhandled and important handled errors with sanitized context.
4. Upload/protect source maps according to policy.
5. Measure field performance and key interaction timings.
6. Propagate approved correlation/trace context to backend requests.
7. Add business-neutral journey signals where useful.
8. Configure sampling and retention intentionally.
9. Build alerts/dashboards around user impact rather than raw event volume.
10. Test telemetry in a deployed non-production environment and simulate failures.

## Decision points
Capture enough context for diagnosis but minimize identifiers. Use session replay only when privacy, consent, redaction, and value justify its risk and cost.

## Common failure patterns
No release tags, missing source maps, logging sensitive payloads, alerting on every exception, high-cardinality dimensions, and telemetry that cannot correlate frontend and backend failures.

## Verification
A simulated deployed error resolves to readable source, release and route; performance signals appear with expected dimensions; sensitive fields are absent; trace correlation works where configured.

## Expected output
Privacy-aware frontend telemetry that supports release diagnosis, performance analysis, and incident triage.

## Stop conditions
Stop when telemetry collection lacks privacy approval, source-map exposure policy is unresolved, or instrumentation would collect prohibited data.