# Optimized Serving Rollout and Canary

## Purpose
Release inference optimizations safely by exposing them gradually, comparing them against a known-good serving path, and retaining fast rollback.

## When to use
Use when deploying new runtimes, kernels, quantization, batching, routing, hardware, or scheduler configurations that can affect performance or model behavior.

## Inputs
Candidate configuration, baseline configuration, rollout controls, representative traffic, performance and quality metrics, rollback path, and release thresholds.

## Context to inspect
Inspect routing topology, model/runtime versions, cache compatibility, session affinity, telemetry, error budgets, benchmark evidence, and whether user-visible output can differ between versions.

## Core knowledge
Offline benchmarks cannot reproduce every production interaction. Canary rollout limits blast radius and reveals traffic-shape, infrastructure, and dependency effects. AI serving changes require both systems metrics and behavioral-quality guardrails. Rollback must account for state and cache compatibility, not only binary versions.

## Procedure
1. Identify all artifacts and configuration that define the candidate serving path.
2. Confirm offline performance and quality gates passed.
3. Establish baseline production metrics before rollout.
4. Route a small representative traffic fraction to the candidate.
5. Compare latency percentiles, throughput, errors, memory, cost, and model-quality proxies against control.
6. Segment results by prompt length, output length, tenant or workload class where appropriate.
7. Increase traffic only after a defined observation window meets thresholds.
8. Watch for cache incompatibility, scheduler instability, and rare OOM/failure patterns.
9. Roll back automatically or manually when hard guardrails fail.
10. Complete rollout only after sustained evidence at meaningful traffic volume.
11. Archive configuration, evidence, and rollback notes.

## Decision points
Use shadow traffic when candidate outputs must not reach users yet. Use canary traffic when real scheduling and generation behavior must be tested. Prefer progressive percentages rather than an immediate fleet-wide switch.

## Common failure patterns
Canarying unrepresentative traffic, comparing different request mixes, missing quality guardrails, leaving rollback untested, sharing incompatible cache state, and declaring success before enough long-context or burst traffic arrives.

## Verification
Confirm candidate and control metrics are comparable, rollback has been exercised or proven, no hard guardrail regressed, and the final production configuration matches the tested candidate.

## Expected output
A completed progressive rollout with documented metrics, quality evidence, decision thresholds, and rollback capability.

## Stop conditions
Stop rollout when hard quality, latency, error, memory, or reliability thresholds fail; when telemetry is insufficient to compare paths; or when rollback cannot be guaranteed.