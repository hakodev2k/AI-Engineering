# Canary, Shadow, and A/B Routing

## Purpose
Introduce new models, providers, or routing policies safely using canary, shadow, and controlled A/B traffic strategies.

## When to use
Use before broad rollout of a new route, model version, provider, routing algorithm, or policy change.

## Inputs
Baseline route, candidate route, evaluation metrics, traffic segmentation, experiment guardrails, privacy constraints, cost budget, and rollback criteria.

## Preconditions
Experiment assignment must be reproducible and must not violate tenant, residency, or policy constraints.

## Context to inspect
Feature flags, experiment platform, route logs, evaluation pipeline, shadow-data handling, provider quotas, and alerting.

## Core knowledge
Shadow traffic observes candidate behavior without returning it to users, but still incurs cost and data-processing obligations. Canarying limits blast radius. A/B tests measure user outcomes but require stable assignment and careful interpretation when model behavior is stochastic.

## Procedure
1. Define the hypothesis and success metrics.
2. Establish baseline quality, latency, cost, and safety.
3. Choose shadow, canary, or A/B based on risk and measurement need.
4. Define eligible traffic and exclusions.
5. Set guardrail thresholds and automatic rollback conditions.
6. Start with minimal traffic or shadow volume.
7. Compare candidate and baseline at segment level.
8. Investigate statistically and operationally significant regressions.
9. Increase exposure only after explicit checkpoints.
10. Record final decision and experiment evidence.

## Decision points
Use shadowing for high-risk behavior validation when outputs must not affect users. Use canary for operational confidence. Use A/B when user-level outcome comparison is necessary and safe.

## Common failure patterns
Shadowing sensitive data to an unapproved provider, unstable experiment assignment, ramping before enough evidence, ignoring tail latency, and changing prompts concurrently with models.

## Verification
Experiment logs prove assignment correctness, candidate exposure remains within policy, and guardrails trigger in controlled tests.

## Expected output
An experiment plan, routing configuration, guardrails, comparative results, and rollout or rollback decision.

## Stop conditions
Stop immediately on safety, privacy, compliance, or severe quality regressions, regardless of aggregate experiment performance.