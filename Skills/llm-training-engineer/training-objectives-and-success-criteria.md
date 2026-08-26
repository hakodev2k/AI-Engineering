# Training Objectives and Success Criteria

## Purpose
Turn a model-training request into measurable technical and product objectives before compute is spent.

## When to use
Use before pretraining, continued pretraining, fine-tuning, or a major training-policy change. Do not use a single benchmark as the objective when deployment behavior is broader.

## Inputs
Target capabilities, intended users, baseline model, evaluation suites, safety requirements, latency/cost constraints, data and compute budget.

## Context to inspect
Existing model cards, prior experiment reports, downstream task distribution, known regressions, deployment constraints, and evaluation methodology.

## Core knowledge
Training loss is a proxy, not the product goal. Senior practice separates capability, robustness, safety, efficiency, and regression criteria; defines confidence intervals and meaningful deltas; and prevents test-set leakage into training decisions.

## Procedure
1. Translate the request into observable capabilities and non-goals.
2. Establish baseline scores and uncertainty.
3. Define primary, guardrail, and diagnostic metrics.
4. Specify evaluation slices for domains, languages, lengths, and risk classes.
5. Set minimum improvement and maximum tolerated regressions.
6. Define compute, wall-clock, memory, and serving constraints.
7. Record evaluation ownership and freeze protected test sets.
8. Define stop/go gates before launching training.
9. Review whether metrics can be gamed by the proposed objective.

## Decision points
Prefer multiple complementary metrics when one metric hides trade-offs. Use human evaluation when automated metrics poorly represent usefulness or safety. Require stronger evidence for expensive or irreversible scale-ups.

## Common failure patterns
Optimizing validation loss alone; moving goalposts after seeing results; benchmark contamination; ignoring inference cost; averaging away critical slice regressions; comparing runs with different evaluation settings.

## Verification
A reviewer can reproduce the baseline, identify every gate, and decide success without subjective reinterpretation after results arrive.

## Expected output
A versioned training objective with measurable gates, evaluation slices, constraints, and decision rules.

## Stop conditions
Stop when objectives conflict, protected evaluations are contaminated, required baselines are unavailable, or safety/compute constraints lack an accountable owner.