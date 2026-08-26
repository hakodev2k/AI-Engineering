# Safe RTC Release Rollout

## Purpose
Release realtime-media changes with measurable risk controls, compatibility protection, and fast rollback.

## When to use
Use for codec, congestion-control, signaling, SFU, TURN, SDK, media-processing, or protocol changes that can affect live sessions.

## Inputs
Change description, affected components, compatibility matrix, test evidence, feature flags, baseline metrics, SLOs, and rollback procedure.

## Core knowledge
RTC regressions are often cohort-specific and may appear as quality degradation rather than outright errors. Rollouts need session-level attribution, mixed-version compatibility, guardrail metrics, and enough observation time to capture network/device diversity.

## Procedure
1. Identify affected media and signaling paths and failure modes.
2. Confirm automated functional, interoperability, impairment, and capacity tests appropriate to the change.
3. Establish baseline setup-success, setup-time, reconnect, loss, RTT, bitrate, freeze, audio concealment, and crash/resource metrics.
4. Ensure the change is attributable by version or feature flag.
5. Define explicit abort thresholds before rollout.
6. Start with internal or low-risk cohorts.
7. Expand gradually across regions, platforms, and network diversity.
8. Compare treatment and control using tail metrics and user impact.
9. Pause on ambiguous degradation; rollback on guardrail breach.
10. Complete rollout only after representative observation and remove obsolete compatibility paths deliberately.

## Decision points
Use feature flags when behavior can be safely switched at runtime; use binary rollback when protocol/runtime state makes toggling unsafe. Canary by the dimension most likely to expose risk, not merely by random percentage.

## Common failure patterns
Global launch after clean-lab testing; no mixed-version coverage; guardrails based only on server errors; changing codec and congestion policy together; rollback path never exercised; declaring success before mobile/network diversity appears.

## Verification
Verify treatment/control attribution, guardrails, compatibility, rollback execution, and stable user-quality metrics through the planned observation window.

## Expected output
A release plan with risk model, staged cohorts, abort criteria, telemetry, rollback, and final verification evidence.

## Stop conditions
Stop rollout immediately for security/privacy regression, unexplained material quality loss, broken compatibility, missing telemetry, or unavailable rollback.