# Production Routing Debugging

## Purpose
Diagnose incorrect, slow, expensive, or unreliable routing behavior in production using evidence rather than ad hoc model switching.

## When to use
Use for unexpected model selection, latency spikes, quality regressions, cost anomalies, fallback storms, quota incidents, or tenant-specific failures.

## Inputs
Incident description, traces, routing events, policy/version history, model health, provider status, cost/usage data, representative failing requests.

## Context to inspect
Recent deployments, registry changes, policy weights, prompt/model versions, rate limits, timeout settings, regional traffic, and experiment assignments.

## Core knowledge
Separate router defects from provider/model defects. Reconstruct the complete decision path: request attributes, eligible candidates, score/rule evaluation, chosen route, downstream outcome, retries, and fallback. Correlation is not root cause.

## Procedure
1. Define incident scope and first known bad time.
2. Compare affected versus healthy cohorts.
3. Reconstruct sampled routing decisions from telemetry.
4. Verify capability registry and policy versions used at decision time.
5. Check provider health, quota, latency, and error changes.
6. Identify whether issue occurs before selection, during inference, or during fallback.
7. Reproduce with sanitized representative inputs in a controlled environment.
8. Test the smallest causal hypothesis.
9. Mitigate with rollback, route disablement, or traffic reduction where justified.
10. Add regression coverage and document root cause.

## Decision points
Rollback when a recent policy change strongly correlates with broad harm and evidence supports reversibility. Disable one route when failures are isolated to that model/provider. Avoid global model upgrades as a debugging shortcut.

## Common failure patterns
Debugging only provider logs, ignoring policy version, changing multiple variables simultaneously, reproducing with unrepresentative prompts, and mistaking fallback success for healthy primary routing.

## Verification
Verify the fix against reproduced failures, production telemetry, unaffected cohorts, and regression tests after rollout.

## Expected output
A root-cause record with evidence, mitigation, permanent fix, and regression protection.

## Stop conditions
Stop and escalate when production access is required beyond authorization, sensitive inputs cannot be handled safely, or evidence indicates a provider-side incident with no local mitigation.