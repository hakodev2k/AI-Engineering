# Online Search Experimentation

## Purpose
Validate search changes with controlled online experiments that connect ranking changes to user behavior without confusing correlation with causation.

## When to use
Use after offline evaluation passes and before broad rollout of material ranking, retrieval, or UX changes.

## Inputs
Experiment hypothesis, eligible traffic, success and guardrail metrics, baseline system, candidate system, segmentation and rollout controls.

## Context to inspect
Existing experimentation platform, unit of randomization, exposure logging, metric definitions, novelty effects, sample-ratio checks, and previous experiments.

## Core knowledge
Search experiments require stable exposure assignment and careful metric interpretation. Click-through rate alone can reward attractive but irrelevant results; downstream success, reformulation, abandonment, conversion, latency, and zero-result behavior may be stronger signals.

## Procedure
1. State a falsifiable hypothesis and expected mechanism.
2. Define primary metric and guardrails before launch.
3. Choose randomization unit that avoids cross-treatment contamination.
4. Log treatment, query, result set, position, and downstream outcome consistently.
5. Estimate required sample size or minimum detectable effect.
6. Run an A/A or instrumentation validation when needed.
7. Start with bounded exposure.
8. Monitor sample-ratio mismatch and operational regressions.
9. Analyze overall and predeclared segments.
10. Decide ship, iterate, or revert from evidence rather than isolated metric movement.

## Decision points
Use interleaving for sensitive ranking comparisons when supported; conventional A/B tests for broader product outcomes. Extend experiments when seasonal or learning effects are plausible.

## Common failure patterns
Changing metrics mid-test, stopping at first significance, ignoring latency, interpreting clicks as relevance, overlapping incompatible experiments, and unlogged fallbacks.

## Verification
Verify exposure integrity, metric computation, statistical confidence, guardrail health, and consistency with offline regression findings.

## Expected output
Experiment design, instrumentation contract, results, segment analysis, guardrail evidence, and shipping decision.

## Stop conditions
Stop or rollback when sample-ratio mismatch appears, safety/latency guardrails breach, or treatment assignment cannot be trusted.