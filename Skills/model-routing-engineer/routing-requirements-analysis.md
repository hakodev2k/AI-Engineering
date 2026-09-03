# Routing Requirements Analysis

## Purpose
Define why model routing is needed and translate product goals into measurable routing objectives across quality, latency, cost, safety, privacy, and availability.

## When to use
Use before introducing a router, adding a provider/model, or changing routing behavior. Do not use when a single fixed model already satisfies requirements without material trade-offs.

## Inputs
Requirements, traffic profile, candidate models, SLAs/SLOs, cost limits, risk constraints, privacy rules, evaluation data.

## Context to inspect
Existing model calls, prompt shapes, response formats, retry behavior, tenancy rules, production incidents, provider quotas, and downstream acceptance criteria.

## Core knowledge
Routing is a multi-objective decision problem. Optimize against explicit constraints rather than a vague notion of the “best” model. Average performance can hide tail latency, failure clusters, or safety regressions.

## Procedure
1. Identify user journeys and model-dependent decisions.
2. Define hard constraints and soft optimization goals.
3. Segment traffic by task, risk, modality, context size, and latency sensitivity.
4. Establish baseline quality, cost, and latency using the current path.
5. List candidate routing signals available at decision time.
6. Define fallback and degraded-service behavior.
7. Specify offline and online metrics.
8. Document unacceptable failure classes.
9. Produce acceptance criteria for router rollout.

## Decision points
Prefer deterministic policy routing when requirements are explicit and stable. Prefer learned or score-based routing when task heterogeneity is high and sufficient labeled data exists.

## Common failure patterns
Optimizing only token price; ignoring tail latency; routing on unavailable future information; missing fallback requirements; mixing safety-critical and low-risk traffic under one policy.

## Verification
Requirements are verified when every routeable traffic class has measurable objectives, hard constraints, candidate actions, and a defined fallback.

## Expected output
A routing requirements specification with traffic segments, constraints, metrics, routing signals, and rollout criteria.

## Stop conditions
Stop when critical SLAs, data residency rules, or acceptable error boundaries are unknown.