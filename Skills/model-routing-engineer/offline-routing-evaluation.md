# Offline Routing Evaluation

## Purpose
Evaluate routing policies on representative historical or synthetic traffic before exposing users to policy changes.

## When to use
Use for new models, new scoring logic, threshold changes, cascades, or provider substitutions.

## Inputs
Frozen routing policy, candidate models, representative requests, labels or evaluators, latency/cost measurements, baseline decisions.

## Context to inspect
Traffic segmentation, evaluation leakage, model versions, prompt versions, tool fixtures, failure labels, and sampling bias.

## Core knowledge
Router evaluation differs from single-model evaluation: measure decision quality and system utility, including cases where the router chooses the wrong model despite both models being individually capable. Replay must account for counterfactual uncertainty when not every request has outputs from every candidate.

## Procedure
1. Freeze dataset, model versions, prompts, and policy version.
2. Stratify examples by task, difficulty, risk, language, context size, and traffic value.
3. Obtain outputs for candidate routes where feasible.
4. Score task quality using validated metrics or blinded judgments.
5. Attach measured or modeled cost and latency.
6. Replay the router and compare with oracle, baseline, and fixed-model policies.
7. Analyze regret and failure clusters.
8. Report confidence intervals and segment-level regressions.
9. Define launch guardrails from the results.

## Decision points
Use human judgments for subjective high-value tasks; deterministic metrics for contract-like tasks; conservative counterfactual assumptions where missing outputs could bias results.

## Common failure patterns
Evaluating only routed outputs, benchmark contamination, averaging away critical segments, using stale prices, and comparing different prompt versions.

## Verification
Verify dataset provenance, evaluator reliability, reproducible replay, and segment-level statistical evidence.

## Expected output
An offline routing evaluation report with baseline comparison, regret analysis, trade-offs, and launch criteria.

## Stop conditions
Stop if the dataset is not representative or route alternatives cannot be evaluated without material bias.