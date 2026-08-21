# AI Experimentation and A/B Testing

## Purpose
Compare AI system changes under real traffic without confusing novelty, traffic mix, or noisy model behavior with genuine improvement.

## When to use
Use when two or more model, prompt, retrieval, agent, or UX variants pass offline evaluation but their real user value remains uncertain.

## Inputs
Candidate variants, offline evaluation results, primary and guardrail metrics, traffic segmentation, experiment duration constraints, risk policy.

## Preconditions
Each candidate must already meet minimum safety, quality, and reliability gates; experiments must not expose users to knowingly unsafe variants.

## Context to inspect
Feature flags, assignment logic, user/session identity, production metrics, model versions, latency/cost, feedback signals, recent traffic changes.

## Core knowledge
Online experiments complement rather than replace offline evaluation. Randomization unit, sample ratio, exposure logging, novelty effects, interference, and guardrail metrics matter. AI metrics should include quality proxies plus latency, cost, errors, safety, and user outcomes.

## Procedure
1. State a falsifiable hypothesis and primary decision metric.
2. Define quality, safety, latency, cost, and reliability guardrails.
3. Choose the randomization unit to avoid cross-variant contamination.
4. Verify assignment is stable and exposure is logged.
5. Start with limited traffic when behavior risk is non-trivial.
6. Monitor sample-ratio mismatch and operational regressions.
7. Run long enough to cover relevant usage cycles rather than stopping on early favorable movement.
8. Analyze important user/task slices and not only the aggregate.
9. Reconcile online results with offline evaluations and qualitative feedback.
10. Ship, revert, or iterate based on predefined criteria and record the decision.

## Decision points
Use shadow evaluation when user exposure is unnecessary. Use A/B testing when user behavior is the key unknown. Prefer gradual rollout over experimentation for changes that are already clearly superior but operationally risky.

## Common failure patterns
Peeking and stopping early, unstable assignment, changing prompts mid-test, no guardrails, optimizing clicks while quality falls, and mixing model-version drift into the experiment.

## Verification
Confirm assignment integrity, exposure counts, metric definitions, statistical/decision criteria, and guardrail compliance before accepting a result.

## Expected output
A reproducible experiment record with evidence, trade-offs, and a clear ship/revert/iterate decision.

## Stop conditions
Stop immediately for safety/privacy violations, severe reliability regressions, broken randomization, or untracked variant changes.