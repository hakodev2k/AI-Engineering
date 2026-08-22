# Optimization Experiment Design

## Purpose
Test uncertain cost optimizations with controlled experiments that measure economic benefit and technical side effects before broad rollout.

## When to use
Use when expected savings are material but workload response, performance impact, or provider economics are uncertain.

## Inputs
Optimization hypothesis, baseline metrics, billing, workload traffic, SLOs, deployment controls, rollback path, unit metrics.

## Context to inspect
Inspect seasonality, traffic segmentation, canary capability, billing granularity/lag, dependencies, autoscaling, and confounding changes.

## Core knowledge
Cost experiments need both economic and technical success criteria. Billing may be too delayed for rapid feedback, so use validated usage proxies while preserving final billing verification.

## Procedure
1. State the hypothesis and mechanism expected to reduce cost.
2. Define baseline and counterfactual.
3. Select cost, unit-cost, reliability, and performance metrics.
4. Define acceptable regression thresholds.
5. Choose a representative test cohort and duration.
6. Freeze or record confounding changes.
7. Implement with rollback capability.
8. Observe technical metrics and usage proxies.
9. Reconcile final effect with billing data.
10. Decide roll out, modify, or reject and record learning.

## Decision points
Use canaries for production-dependent behavior; use load tests for repeatable capacity comparisons. Stop early on SLO or correctness regression even if cost improves.

## Common failure patterns
No baseline, changing several variables at once, using an unrepresentative quiet period, measuring only spend, and rolling out before delayed billing validates the model.

## Verification
Experiment is reproducible; technical guardrails pass; observed cost mechanism matches hypothesis; final billing supports the conclusion.

## Expected output
An experiment plan, measurements, decision, confidence, realized/projected economics, and rollout guidance.

## Stop conditions
Abort when correctness, security, or reliability guardrails breach or the experiment cannot isolate the proposed effect.