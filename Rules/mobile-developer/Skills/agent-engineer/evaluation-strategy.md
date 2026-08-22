# Agent Evaluation Strategy

## Purpose
Build repeatable evidence that an agent is useful, safe, and improving rather than relying on demos.

## When to use
Use before launch, during model/prompt/tool changes, and for regression control.

## Inputs
User tasks, success criteria, production traces, risk cases, baseline system, budgets.

## Context to inspect
Current behavior, known incidents, task distribution, tool traces, model versions, and business outcomes.

## Core knowledge
Agent evaluation must cover end outcomes and trajectories: reasoning proxies, tool selection, arguments, recovery, safety, latency, and cost. Exact-match scoring is often insufficient.

## Procedure
1. Define task taxonomy and critical failure classes.
2. Build representative frozen test cases.
3. Add adversarial and dependency-failure cases.
4. Define deterministic graders where possible.
5. Use rubric/model grading only with calibration.
6. Capture trajectory metrics for tool-using tasks.
7. Establish baseline quality, latency, and cost.
8. Run evaluations on every material change.
9. Analyze regressions by task segment.
10. Feed production failures back into the suite.

## Decision points
Prefer deterministic assertions for contracts and safety; human or model rubrics for nuanced quality.

## Common failure patterns
Cherry-picked demos, tiny test sets, uncalibrated LLM judges, no negative cases, and optimizing one aggregate score.

## Verification
Ensure tests are reproducible, graders correlate with expert judgment, and release thresholds catch known regressions.

## Expected output
A versioned evaluation suite with baselines, thresholds, and segmented results.

## Stop conditions
Stop release when critical safety or correctness thresholds regress without explicit acceptance.