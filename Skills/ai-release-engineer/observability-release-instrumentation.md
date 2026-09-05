# Release Observability and Instrumentation

## Purpose
Ensure each AI release is observable enough to attribute regressions to a specific artifact set, cohort, model route, or dependency.

## When to use
Use before rollout of any change affecting model behavior, retrieval, agents, tools, routing, latency, or cost.

## Inputs
Release manifest, telemetry architecture, SLOs, evaluation metrics, alerting policy, cohort definitions.

## Preconditions
Requests can be correlated across application, model, retrieval, and tool boundaries.

## Context to inspect
Logs, traces, metrics, sampling, model/prompt version dimensions, feature flags, provider metadata, token usage, safety signals, tool audit events, and dashboards.

## Core knowledge
Without release dimensions, production regressions become difficult to attribute. AI observability must cover semantic and behavioral signals in addition to HTTP and infrastructure health.

## Procedure
1. Attach release ID to every request trace.
2. Record resolved model, prompt, route, index, and tool versions.
3. Capture latency, errors, token usage, and cost.
4. Add quality/safety indicators appropriate to the workload.
5. Record retrieval and tool-action outcomes.
6. Segment dashboards by release cohort and critical tenant/user classes.
7. Define abort alerts from rollout thresholds.
8. Verify sampling does not hide rare high-risk events.
9. Exercise dashboards with synthetic failures.
10. Confirm responders can navigate from alert to representative traces.

## Decision points
Increase sampling for new or high-risk releases, but minimize sensitive data and follow retention policy.

## Common failure patterns
No prompt/model version in traces, aggregate-only metrics, uncorrelated provider logs, missing tool actions, and dashboards created after deployment.

## Verification
Inject or replay known failure scenarios and confirm the candidate release can be isolated quickly in telemetry.

## Expected output
Release-aware dashboards, alerts, trace dimensions, and documented diagnostic paths.

## Stop conditions
Stop rollout when critical regressions cannot be detected or attributed within the required response time.