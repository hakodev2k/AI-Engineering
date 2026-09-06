# Pilot Design and Success Criteria

## Purpose
Design AI pilots that test the riskiest assumptions with enough operational realism to support a scale, revise, or stop decision.

## When to use
Use after a use case is qualified but before broad rollout.

## Inputs
Use-case brief, baseline metrics, target users, workflow map, model/system design, risk profile, available sample size, budget, and time constraints.

## Context to inspect
Inspect production-like data, representative user segments, current process performance, exception frequency, integration boundaries, and downstream consequences.

## Core knowledge
A pilot is an experiment, not a small launch. It should isolate decision-critical uncertainty, preserve a baseline, capture both average outcomes and harmful edge cases, and define exit criteria before results are known.

## Procedure
1. List the assumptions that could invalidate the use case.
2. Rank them by uncertainty and consequence.
3. Define primary success metrics and guardrail metrics.
4. Capture the current baseline using the same definitions.
5. Select representative users, tasks, and edge cases.
6. Decide shadow, assisted, or live operating mode based on risk.
7. Define human review and rollback controls.
8. Instrument quality, time, cost, adoption, corrections, and failures.
9. Predefine pass, revise, and stop thresholds.
10. Run the pilot long enough to observe realistic variation.
11. Analyze segment-level and exception behavior.
12. Make an evidence-based recommendation.

## Decision points
Use shadow mode when actions are high impact or unproven. Use assisted mode when user review is meaningful. Use live automation only for low-risk, reversible behavior with strong controls.

## Common failure patterns
Cherry-picking friendly users, changing success thresholds after results, comparing against no baseline, ignoring correction labor, and declaring success from engagement alone.

## Verification
Confirm the pilot includes baseline evidence, representative cases, predefined thresholds, and a documented decision based on observed results.

## Expected output
A pilot plan and final decision package with metrics, guardrails, evidence, limitations, and scale recommendations.

## Stop conditions
Stop when representative data cannot be obtained, safety controls are missing, or the pilot cannot produce evidence for the intended decision.