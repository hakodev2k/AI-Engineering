# Model Rollout and Canary

## Purpose
Release model/runtime changes safely while detecting quality, latency, stability, and cost regressions early.

## When to use
Use for model revisions, quantization, runtime upgrades, kernel changes, or serving configuration changes.

## Inputs
Candidate artifact, baseline, offline evaluation, SLOs, routing controls, rollback mechanism, and observability.

## Context to inspect
Version routing, sticky sessions if needed, metrics labels, dashboards, alerting, compatibility, and client contracts.

## Core knowledge
A serving change can alter both system behavior and model behavior. Canary decisions require quality and operational metrics segmented by version and workload class.

## Procedure
1. Require offline correctness/quality and load-test gates before traffic.
2. Verify artifact identity and runtime compatibility.
3. Deploy dark or zero-traffic replicas and run health/smoke checks.
4. Route a small representative traffic fraction.
5. Compare errors, TTFT, inter-token latency, throughput, GPU memory, cost, and approved quality proxies.
6. Increase exposure in bounded stages with observation windows.
7. Halt automatically on predefined guardrails.
8. Roll back by routing/artifact identity, not ad-hoc mutation.
9. Complete post-rollout comparison and remove obsolete capacity only after stability.

## Decision points
Use shadowing when responses need not reach users; use canaries when true client behavior is required. Keep longer observation for rare failure modes.

## Common failure patterns
Canary traffic not representative, metrics not versioned, simultaneous unrelated changes, and rollback requiring a new build.

## Verification
Demonstrate successful rollback, version-specific dashboards, and stable metrics at full traffic.

## Expected output
Controlled rollout with recorded gates and evidence.

## Stop conditions
Stop rollout immediately on safety/quality threshold breach, unexplained error increase, or SLO regression.