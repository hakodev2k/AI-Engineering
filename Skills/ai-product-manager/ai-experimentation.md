# AI Experimentation

## Purpose
Design experiments that distinguish genuine product improvement from model variance, novelty effects, and measurement noise.

## When to use
Use for prompt, model, retrieval, UX, pricing, or workflow changes where product impact is uncertain.

## Inputs
Hypothesis, target population, baseline behavior, candidate change, online metrics, offline evals, sample-size constraints, risk limits.

## Context to inspect
Traffic allocation, seasonality, model nondeterminism, instrumentation quality, prior experiments, user segmentation, and guardrail metrics.

## Core knowledge
AI experiments require both product outcomes and behavior-quality measures. Offline gains can fail online because users adapt, latency changes, or error types shift.

## Procedure
1. State one falsifiable product hypothesis.
2. Define primary, secondary, and guardrail metrics.
3. Establish an offline evaluation gate before exposure.
4. Choose the smallest representative user segment that can answer the question.
5. Control model version, prompt version, retrieval configuration, and routing.
6. Instrument exposure and downstream user outcomes.
7. Run long enough to reduce novelty and temporal bias where practical.
8. Analyze aggregate and important segment-level effects.
9. Review qualitative failures before making a rollout decision.

## Decision points
Use A/B tests for causal product impact when traffic permits. Use staged pilots or interleaving when risk, low volume, or user workflow makes standard experiments impractical.

## Common failure patterns
Changing multiple system layers at once, using engagement alone as success, ignoring quality regressions, and stopping on early favorable noise.

## Verification
Confirm experiment assignment, logging, metric computation, and offline behavior are reproducible before trusting results.

## Expected output
An experiment decision with hypothesis, design, metrics, results, segment analysis, and rollout recommendation.

## Stop conditions
Stop when instrumentation is invalid, user risk exceeds the test boundary, or sample bias prevents a defensible conclusion.