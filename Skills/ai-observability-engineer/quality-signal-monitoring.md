# Quality Signal Monitoring

## Purpose
Monitor production indicators of AI output quality while separating heuristic signals from validated evaluation results.

## When to use
Use when detecting semantic regressions, routing changes, prompt releases, or changing user behavior.

## Inputs
Offline evaluations, user feedback, task outcomes, moderation/safety outcomes, traces, model/config versions, and sampling rules.

## Context to inspect
Inspect available ground truth, feedback bias, evaluator definitions, delayed business outcomes, experiment cohorts, and privacy constraints.

## Core knowledge
No single production metric represents AI quality. Useful signals combine explicit feedback, task success, deterministic validators, sampled model-based evaluation, and offline benchmark results. Each signal has bias and uncertainty.

## Procedure
1. Define quality dimensions relevant to the product: correctness, groundedness, format adherence, safety, task completion, or others.
2. Map each dimension to available evidence and document limitations.
3. Instrument deterministic signals first.
4. Add sampled human or model-based evaluation with versioned rubrics where justified.
5. Segment signals by model/configuration and workload class.
6. Establish baseline distributions and confidence intervals where appropriate.
7. Correlate quality shifts with deployments and routing changes.
8. Require offline or human validation before declaring semantic improvement from a proxy.

## Decision points
Use model judges for scalable triage, not unquestioned ground truth. Prefer business outcomes when causal linkage is credible and latency is acceptable.

## Common failure patterns
Optimizing thumbs-up rate alone, changing evaluator and model simultaneously, hidden sampling bias, treating judge scores as absolute truth, and alerting on tiny low-volume fluctuations.

## Verification
Backtest signals against labeled examples and verify version segmentation detects a known controlled regression.

## Expected output
A documented quality-signal portfolio, dashboards, sampling strategy, and validation evidence.

## Stop conditions
Stop if there is no defensible definition of quality or monitoring would create unacceptable privacy risk.