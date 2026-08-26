# Network Impairment Testing

## Purpose
Validate RTC behavior under realistic bandwidth, loss, latency, jitter, reordering, and connectivity changes before users encounter them.

## When to use
Use for release qualification, congestion-control changes, codec tuning, incident reproduction, and resilience testing.

## Inputs
Production network distributions, target SLOs, test clients, impairment tooling, baseline metrics, and representative scenarios.

## Core knowledge
Realtime systems fail differently under steady versus burst loss, asymmetric paths, changing bandwidth, queueing, and handoffs. Tests must preserve repeatability while reflecting real cohorts.

## Procedure
1. Define a clean-network baseline.
2. Select impairment profiles from observed production conditions.
3. Include steady and burst loss, latency, jitter, bandwidth steps, reordering, and UDP blocking where relevant.
4. Run uplink and downlink asymmetry separately.
5. Measure setup, bitrate, RTT, jitter, freezes, concealment, frame rate, and recovery time.
6. Test network handoff and temporary disconnection.
7. Repeat enough runs to separate signal from variance.
8. Compare candidate behavior to baseline and acceptance thresholds.
9. Preserve profiles as regression tests.

## Decision points
Use synthetic impairment for controlled causality and field tests for ecological validity. Avoid a single universal network profile; prioritize cohorts that drive business or reliability risk.

## Common failure patterns
Only testing constant packet loss; ignoring asymmetry; changing multiple parameters without a baseline; judging by visual impression alone; non-repeatable profiles; excluding setup/reconnect behavior.

## Verification
Results must be repeatable, instrumented, and evaluated against explicit quality/recovery thresholds rather than anecdotal success.

## Expected output
A reusable impairment matrix, measured regressions, and pass/fail evidence.

## Stop conditions
Stop when test tooling itself introduces uncontrolled loss or when production-like conditions cannot be reproduced with known confidence.