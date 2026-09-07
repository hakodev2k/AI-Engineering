# Performance Regression Triage

## Purpose
Rapidly isolate, quantify, and remediate web-performance regressions while distinguishing application changes from telemetry, traffic, browser, backend, or third-party effects.

## When to use
Use when RUM, synthetic tests, or release gates show a meaningful deterioration in user-facing latency or responsiveness.

## Inputs
Regression alert, RUM/synthetic data, deployment history, feature flags, browser traces, bundle diffs, infrastructure and vendor events.

## Context to inspect
Determine the first affected time/release, impacted routes and cohorts, metric magnitude, traffic exposure, concurrent experiments, instrumentation changes, and rollback options.

## Core knowledge
Effective triage narrows scope before optimizing. Changes in user mix, browser versions, telemetry sampling, CDN behavior, backend latency, and third parties can mimic frontend regressions. Correlation with a deployment is evidence, not proof.

## Procedure
1. Validate that the signal is real and statistically meaningful.
2. Quantify affected users, routes, percentiles, and business exposure.
3. Identify the earliest bad release/time window.
4. Compare code, dependency, asset, config, feature-flag, and vendor changes.
5. Segment until a discriminating pattern emerges without overfitting tiny cohorts.
6. Reproduce a representative case and capture trace/waterfall evidence.
7. Classify the dominant layer: server, network, loading, JavaScript, rendering, memory, or third party.
8. Test the smallest falsifiable rollback or mitigation.
9. Deploy safely and monitor recovery.
10. Add a regression test, budget, or telemetry improvement that would detect recurrence earlier.

## Decision points
Rollback immediately when impact is high and rollback risk is low; otherwise mitigate behind a flag while investigating. Prefer reversible changes during incidents. Escalate cross-layer causes to the owning team with evidence.

## Common failure patterns
Optimizing before validating the signal; blaming the latest commit without cohort evidence; changing multiple variables at once; relying on one lab run; failing to preserve traces before rollback.

## Verification
Confirm the affected production distribution returns toward baseline, the suspected cause is reproduced or disproved, and adjacent metrics/business guardrails remain healthy.

## Expected output
A concise incident timeline, quantified impact, root-cause evidence, remediation, and durable regression prevention.

## Stop conditions
Escalate when production access or rollback authority is missing, evidence points to another service/vendor, or telemetry is too unreliable to establish causality.