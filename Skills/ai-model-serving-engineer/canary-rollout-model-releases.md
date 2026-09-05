# Canary Rollout for Model Releases

## Purpose
Release new model, runtime, quantization, or serving configurations gradually with measurable rollback criteria.

## When to use
Use for any serving change that can alter correctness, safety, latency, memory, cost, or compatibility.

## Inputs
Candidate artifact, baseline version, evaluation results, traffic segmentation, SLOs, rollback mechanism, and observability.

## Preconditions
Offline validation passes and rollback to a known-good version is tested.

## Context to inspect
Model aliases, deployment controller, routing weights, artifact versions, prompt/tool compatibility, cache behavior, and dashboards.

## Core knowledge
Serving regressions can be workload-specific and may not appear in offline benchmarks. Canarying limits blast radius and provides real distribution evidence before broad rollout.

## Procedure
1. Record exact candidate and baseline versions.
2. Define success metrics and hard rollback thresholds.
3. Select a representative low-risk canary segment.
4. Start with small traffic share.
5. Compare latency, errors, throughput, memory, quality proxies, and cost to baseline.
6. Check long-context and high-concurrency segments separately.
7. Increase traffic only after a stable observation window.
8. Pause or rollback immediately on threshold breach.
9. Complete rollout gradually and retain baseline rollback capacity.
10. Archive release evidence.

## Decision points
Use shadow traffic when output must not affect users. Use active canary when real downstream behavior is required to validate compatibility.

## Common failure patterns
No explicit rollback threshold, canary traffic not representative, changing multiple unrelated variables, and removing rollback capacity too early.

## Verification
Candidate meets predefined technical and quality thresholds across representative segments before full rollout.

## Expected output
A release record with traffic stages, metrics, decisions, and rollback evidence.

## Stop conditions
Stop rollout on correctness, safety, security, memory, or tail-latency regression beyond approved tolerance.