# Release Validation

## Purpose
Prove that a deployed release is functioning correctly in its target environment rather than assuming deployment success equals product health.

## When to use
Use immediately after deployment and during progressive rollout stages.

## Inputs
Release scope, expected behaviors, health endpoints, logs, metrics, traces, synthetic tests, business KPIs, and baseline values.

## Preconditions
Telemetry can identify the candidate version and validation actions are safe for the target environment.

## Context to inspect
Inspect deployment status, application errors, latency, saturation, dependency health, critical user journeys, queue/backlog behavior, and business outcomes affected by the release.

## Core knowledge
Validation should combine technical health with release-specific behavior. Generic uptime checks miss silent functional regressions. Signals need baselines and thresholds appropriate to traffic volume and observation latency.

## Procedure
1. Identify behaviors and risks changed by the release.
2. Map each risk to observable signals or safe probes.
3. Capture pre-release baseline where meaningful.
4. Confirm deployed artifact identity.
5. Run smoke/synthetic validation.
6. Compare error, latency, resource, and dependency signals.
7. Validate critical business outcomes or event flows.
8. Observe for delayed failures appropriate to workload.
9. Decide advance, hold, rollback, or investigate.
10. Store validation evidence with the release record.

## Decision points
Automate deterministic checks; use human validation for nuanced workflows only when automation is impractical. Extend observation windows for low-volume or delayed-processing systems.

## Common failure patterns
Checking only pod/process health, metrics not segmented by version, validating too soon, no baseline, synthetic tests that mutate production unsafely, and ignoring business-level failures.

## Verification
Inject or simulate a known validation failure in a safe environment and confirm the release is held or failed. Confirm evidence identifies the exact artifact.

## Expected output
Release-specific validation evidence and a clear disposition: healthy, held, recovered, or escalated.

## Stop conditions
Stop progression when artifact identity is uncertain, required signals are unavailable, validation reveals unexplained regression, or safe probing cannot be performed.