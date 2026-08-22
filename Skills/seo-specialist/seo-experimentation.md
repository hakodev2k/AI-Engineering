# SEO Experimentation

## Purpose
Evaluate SEO changes with controlled evidence where feasible instead of relying on before/after anecdotes.

## When to use
Use for scalable template changes, uncertain optimizations, or competing implementation options with measurable outcomes.

## Inputs
Hypothesis, eligible pages, traffic history, metrics, implementation capability, seasonality, and test duration constraints.

## Context to inspect
Page similarity, baseline trends, releases, external events, sample size, contamination risks, and measurement lag.

## Core knowledge
SEO experiments often operate on page groups rather than users. Good tests require comparable controls, predeclared metrics, and enough time for crawling and response.

## Procedure
1. State a falsifiable hypothesis and mechanism.
2. Choose primary and guardrail metrics.
3. Select comparable treatment/control groups where possible.
4. Check pre-test trend similarity.
5. Freeze unrelated changes to the test scope.
6. Deploy treatment and annotate timing.
7. Monitor crawl/indexation and data quality.
8. Analyze effect size and uncertainty.
9. Decide rollout, iteration, or rejection.

## Decision points
Use controlled tests when scale permits; use careful quasi-experiments for unique pages or migrations where controls are impossible.

## Common failure patterns
Stopping early, cherry-picking metrics, testing heterogeneous pages, and ignoring algorithm/seasonal events.

## Verification
Confirm treatment deployed correctly, controls stayed unchanged, and analysis can be reproduced.

## Expected output
Hypothesis, design, results, uncertainty, and rollout decision.

## Stop conditions
Stop if sample quality or concurrent changes invalidate inference.