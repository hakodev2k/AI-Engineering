# Multi-Objective Ranking

## Purpose
Balance user utility, business value, quality, safety, and ecosystem constraints in a controlled ranking policy.

## When to use
Use when one metric cannot represent the product's real decision trade-offs.

## Inputs
Component objectives, calibrated scores, hard constraints, stakeholder priorities, guardrails, and experiment history.

## Context to inspect
Metric conflicts, score scales, segment effects, inventory economics, policy requirements, and long-term outcomes.

## Core knowledge
Weighted sums are simple but sensitive to scale and can hide trade-offs. Constraints, Pareto analysis, lexicographic policies, and learned utility functions are alternatives. Hard safety/eligibility rules should not be treated as soft preferences.

## Procedure
1. Separate hard constraints from optimization objectives.
2. Define each objective and measurement window.
3. Calibrate or normalize component scores.
4. Establish current operating point and trade-off frontier.
5. Simulate candidate weighting/constraint policies offline.
6. Stress-test important cohorts and inventory segments.
7. Experiment with bounded changes.
8. Document chosen trade-offs and ownership.

## Decision points
Use constraints for non-negotiable requirements; weighted objectives for negotiable trade-offs; learned combinations only when labels and governance are strong.

## Common failure patterns
Uncalibrated score addition, hidden stakeholder weights, optimizing short-term revenue against retention, softening safety constraints, and aggregate wins masking cohort harm.

## Verification
Check constraint satisfaction, sensitivity to weights, Pareto trade-offs, online guardrails, and stability across cohorts.

## Expected output
An explicit multi-objective policy with justified weights/constraints and measured trade-offs.

## Stop conditions
Stop when objectives conflict without accountable prioritization or a proposed trade-off violates policy or safety boundaries.