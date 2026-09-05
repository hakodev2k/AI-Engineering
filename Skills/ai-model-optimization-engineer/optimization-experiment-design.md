# Optimization Experiment Design

## Purpose
Run optimization work as controlled experiments that isolate causality and avoid local, non-reproducible wins.

## When to use
When evaluating model, runtime, precision, scheduling, kernel, or infrastructure changes.

## Inputs
Baseline, bottleneck evidence, hypothesis, candidate change, success metrics, quality/SLO guardrails.

## Preconditions
One authoritative baseline and versioned benchmark suite exist.

## Context to inspect
Inspect prior experiments, confounders, deployment constraints, statistical variance, interactions with batching/hardware, and rollback cost.

## Core knowledge
Optimization is multi-objective and interactions are common. Sequential uncontrolled tweaks make attribution impossible; experiments should maximize information gained per engineering cost.

## Procedure
1. Write a falsifiable bottleneck hypothesis.
2. Predict which metrics should change and why.
3. Define hard guardrails and acceptance thresholds.
4. Hold unrelated variables constant.
5. Run baseline and candidate with repeated trials.
6. Inspect mechanism-level evidence as well as end-to-end results.
7. Record negative and neutral outcomes.
8. Test interaction with critical production dimensions.
9. Decide adopt, reject, or refine.
10. Update the optimization backlog from evidence.

## Decision points
Use factorial experiments when interactions are central and affordable; otherwise isolate one major factor at a time. Prioritize experiments with high expected impact and low uncertainty/cost.

## Common failure patterns
Changing many variables, post-hoc success metrics, deleting failed results, optimizing benchmarks rather than workloads, and accepting noise as improvement.

## Verification
Results are reproducible, attributable to the tested change, and satisfy all predefined guardrails.

## Expected output
Experiment record with hypothesis, configuration, evidence, conclusion, and next decision.

## Stop conditions
Stop when the baseline drifts, confounders cannot be controlled, or evidence disproves the optimization premise.