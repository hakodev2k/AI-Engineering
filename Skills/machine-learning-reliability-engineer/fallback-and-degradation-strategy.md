# Fallback and Degradation Strategy

## Purpose
Design safe fallback behavior so an ML-dependent product can continue operating when predictions, features, models, or dependencies become unreliable.

## When to use
Use before production launch, during reliability reviews, or after incidents where ML failures caused excessive user or business impact.

## Inputs
- Critical user journeys
- Model and feature dependencies
- Existing deterministic rules or previous models
- Failure severity and risk tolerance
- Latency and availability objectives

## Context to inspect
Inspect what happens when inference times out, features are missing or stale, the model registry is unavailable, quality degrades, or the current model must be disabled.

## Core knowledge
Fallbacks should reduce harm, not merely preserve availability. Options include abstention, cached predictions, a prior known-good model, heuristic rules, reduced-feature models, manual review, or disabling the ML-driven action. Every fallback has freshness, correctness, and capacity limits.

## Procedure
1. Enumerate failure modes for model, feature, data, network, and dependency paths.
2. Rank each by user impact and acceptable duration.
3. Select a fallback appropriate to each failure mode.
4. Define activation signals and thresholds.
5. Ensure fallback dependencies do not share the same failure domain where possible.
6. Define maximum fallback duration and freshness limits.
7. Add telemetry identifying fallback reason and volume.
8. Test recovery from fallback to primary behavior without double actions or state corruption.
9. Document operator controls and escalation paths.
10. Exercise the strategy under load and dependency failure.

## Decision points
Prefer abstention or manual review when incorrect actions are worse than unavailable predictions. Prefer a prior model when feature and runtime compatibility are guaranteed. Prefer deterministic rules for narrow, safety-critical behavior with well-understood boundaries.

## Common failure patterns
- Fallback uses the same broken feature service.
- Cached predictions exceed safe freshness.
- Silent fallback hides prolonged degradation.
- Prior model cannot consume current feature schema.
- Recovery causes duplicate downstream actions.

## Verification
Trigger each planned failure mode and verify activation, correctness, telemetry, capacity, duration limits, and clean restoration to primary service.

## Expected output
A documented fallback matrix with triggers, behavior, dependencies, limits, monitoring, and recovery steps.

## Stop conditions
Stop if no safe fallback exists for a high-impact failure or if fallback correctness cannot be validated under realistic conditions.