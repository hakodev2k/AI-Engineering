# Model Selection and Routing

## Purpose
Choose and route tasks to models based on measured capability, cost, latency, context, and risk rather than brand assumptions.

## When to use
Use when introducing a model, reducing cost/latency, supporting multiple task classes, or migrating providers/versions.

## Inputs
Task slices, eval suite, model candidates, pricing, latency, context limits, modality/tool requirements, and risk constraints.

## Context to inspect
Inspect production traffic distribution, current model settings, failure rates, token usage, and provider limits.

## Core knowledge
Model performance is task-specific. Routing creates operational complexity and must account for fallback behavior and evaluation drift.

## Procedure
1. Partition workload into meaningful task/risk slices.
2. Define minimum quality thresholds per slice.
3. Benchmark candidate models on the same versioned evals.
4. Measure latency and token/cost distributions.
5. Check required tool, schema, modality, and context features.
6. Select the cheapest/fastest model that clears each threshold with margin.
7. Define routing signals available before inference.
8. Define fallback conditions and cap fallback chains.
9. Shadow or canary new routes.
10. Monitor quality, cost, latency, and routing drift.

## Decision points
Use one model when operational simplicity outweighs savings. Route only when slices are distinguishable reliably. Escalate to stronger models for high-risk or hard cases when measurable signals support it.

## Common failure patterns
Benchmarking only average quality; ignoring long-tail latency; routing based on model self-confidence without calibration; unbounded fallbacks; silently changing model versions.

## Verification
Replay representative traffic, compare slice-level thresholds, validate routing determinism, and monitor post-release distributions.

## Expected output
Model decision matrix, routing policy, fallback policy, and benchmark evidence.

## Stop conditions
Stop if candidate versions are not pinned, evaluation coverage is insufficient, or routing would violate data residency/security requirements.