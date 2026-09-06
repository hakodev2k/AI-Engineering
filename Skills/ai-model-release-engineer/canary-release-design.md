# Canary Release Design

## Purpose
Design a bounded production canary that exposes a candidate to real traffic while limiting blast radius and producing decision-quality evidence.

## When to use
Use for releases where offline evidence is insufficient and production behavior can be safely sampled.

## Inputs
Candidate, baseline, routing capabilities, user segments, risk classification, SLOs, success metrics, rollback mechanism, and monitoring.

## Preconditions
Traffic can be isolated or attributed, and rapid rollback is available.

## Context to inspect
Inspect routing keys, sticky-session needs, experiment contamination, regional topology, model caches, downstream dependencies, and alerting latency.

## Core knowledge
A canary is a risk-control mechanism, not merely a small deployment. Exposure should increase only when evidence supports it; metrics must distinguish candidate from baseline.

## Procedure
1. Define canary hypothesis and promotion/rollback criteria.
2. Select the smallest representative traffic segment.
3. Exclude users or workflows where experimentation is inappropriate.
4. Ensure candidate-specific telemetry and version labels.
5. Set exposure caps, duration, and automatic abort thresholds.
6. Start at minimal traffic and observe warm-up effects.
7. Compare quality, safety, errors, latency, cost, and downstream health.
8. Increase exposure in predefined stages only after gate review.
9. Roll back immediately on critical thresholds.
10. Archive evidence and final decision.

## Decision points
Use user-sticky routing when cross-version experience would confound outcomes. Prefer region or tenant isolation when infrastructure effects matter more than random sampling.

## Common failure patterns
Canary without attribution, ramping too quickly, ignoring low-frequency severe failures, no automatic abort, and measuring only infrastructure metrics.

## Verification
Confirm routing percentages, telemetry labels, abort automation, rollback path, and statistically or operationally sufficient observation windows.

## Expected output
A staged canary plan with traffic scope, gates, abort criteria, and evidence collection.

## Stop conditions
Stop if traffic cannot be isolated, rollback is unreliable, candidate telemetry is ambiguous, or canary exposure would violate policy or contractual constraints.
