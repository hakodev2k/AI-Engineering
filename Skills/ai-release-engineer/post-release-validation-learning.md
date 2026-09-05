# Post-Release Validation and Learning

## Purpose
Verify that an AI release performs correctly under real production conditions, detect delayed regressions, and convert rollout evidence into better future release controls.

## When to use
Use after every material production rollout and especially after model, prompt, retrieval, routing, or agent changes.

## Inputs
Release manifest, production metrics, evaluation baselines, incident signals, user feedback, cost data, latency data, rollout thresholds.

## Preconditions
The release remains attributable in telemetry and a rollback window or recovery path is still available.

## Context to inspect
Release cohorts, quality and safety signals, provider behavior, tool actions, retrieval metrics, SLOs, spend, support reports, and known release risks.

## Core knowledge
Offline and staging evidence cannot perfectly predict production distribution, provider variability, user behavior, or long-tail failures. Release completion requires production verification, not merely successful deployment.

## Procedure
1. Confirm the deployed artifact set matches the approved manifest.
2. Compare production outcomes against pre-release baselines.
3. Review quality, safety, security, latency, errors, token usage, and cost by important segments.
4. Examine tool-action accuracy and authorization denials for agentic systems.
5. Review retrieval relevance and access controls for grounded systems.
6. Investigate user feedback and support reports for novel failure modes.
7. Watch long enough to capture delayed effects appropriate to the workload.
8. Decide whether to complete rollout, hold, constrain, or roll back.
9. Record unexpected behavior and update evaluation datasets, alerts, or runbooks.
10. Close temporary flags and release exceptions only after stability criteria are met.

## Decision points
Treat real-user high-severity failures as more important than aggregate improvements. Extend observation windows for low-frequency or delayed-risk workflows.

## Common failure patterns
Declaring success after deployment health checks, ignoring segment-specific regressions, closing rollback paths too early, and failing to feed production failures back into pre-release evaluations.

## Verification
Confirm acceptance criteria are met in production over the required observation window and all material anomalies have documented disposition.

## Expected output
A production validation record with release outcome, regressions, residual risks, and concrete improvements to future release gates.

## Stop conditions
Do not close the release when critical metrics are unstable, unexplained severe failures remain, or rollback/containment decisions are still active.