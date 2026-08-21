# Model Selection and Routing

## Purpose
Choose and route models according to task complexity, quality, latency, cost, and risk.

## When to use
Use when selecting a production model or operating multiple model tiers/providers.

## Inputs
Task taxonomy, evaluation results, model capabilities, context limits, prices, latency, availability constraints.

## Context to inspect
Prompt/tool requirements, structured-output needs, regional constraints, fallback behavior, and production workload mix.

## Core knowledge
Model choice is workload-specific. A stronger model is not automatically the best system choice. Routing must be evaluated end-to-end, including tool behavior and hard cases.

## Procedure
1. Segment workload by complexity and risk.
2. Define quality thresholds per segment.
3. Benchmark candidate models on the same frozen suite.
4. Measure latency, cost, tool accuracy, and structured-output reliability.
5. Choose a default and justified exceptions.
6. Define deterministic routing signals where possible.
7. Add fallback rules for availability and capability failures.
8. Prevent silent provider/model changes from bypassing evaluation.
9. Canary model updates.
10. Re-evaluate periodically as workloads and models change.

## Decision points
Use one model when operational simplicity dominates. Route when workload segments show meaningful economic or quality separation.

## Common failure patterns
Benchmarking only generic tasks, routing on prompt length alone, ignoring tool accuracy, uncontrolled fallback, and model-version drift.

## Verification
Confirm every routed segment meets its quality and safety thresholds under expected latency and cost.

## Expected output
A model matrix, routing policy, fallback strategy, and benchmark evidence.

## Stop conditions
Stop rollout when candidate behavior is not reproducibly evaluated on critical tasks.