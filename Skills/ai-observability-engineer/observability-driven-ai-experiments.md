# Observability-Driven AI Experiments

## Purpose
Instrument AI experiments so quality, latency, reliability, and cost trade-offs can be compared without cohort contamination.

## When to use
Use for model swaps, prompt changes, routing experiments, retrieval changes, or decoding-parameter tests.

## Inputs
Experiment design, treatment assignment, success metrics, guardrails, model/config versions, and telemetry.

## Context to inspect
Inspect assignment unit, exposure timing, cross-over risk, baseline metrics, sample size, delayed outcomes, and operational constraints.

## Core knowledge
Experiment telemetry must distinguish assignment from actual exposure. AI changes often move several dimensions simultaneously, so quality gains should be evaluated alongside latency, errors, tokens, and cost.

## Procedure
1. Define hypothesis, primary outcome, and operational guardrails before launch.
2. Choose a stable randomization unit and document exclusions.
3. Emit experiment ID and treatment on traces/logs using bounded values.
4. Record actual model/config/index versions used.
5. Track exposure, not merely assignment.
6. Compare quality, SLO, latency, token, cost, and fallback metrics by treatment.
7. Monitor sample-ratio mismatch and telemetry loss.
8. Stop or roll back when predefined guardrails breach.
9. Preserve results with exact configuration versions.

## Decision points
Use online experiments for user-impact validation and offline evaluations for rapid semantic iteration. Avoid concurrent experiments that interact unless factorial design is intentional.

## Common failure patterns
Missing exposure events, treatment leakage, changing evaluator mid-test, peeking without correction, ignoring cost, and aggregating across heterogeneous workloads.

## Verification
Run an A/A test or controlled assignment check and confirm balanced cohorts, correct exposure attribution, and identical baseline behavior.

## Expected output
Experiment telemetry schema, guardrail dashboards, attribution evidence, and reproducible results.

## Stop conditions
Stop when randomization is invalid, sample-ratio mismatch is unexplained, or guardrail breaches require termination.