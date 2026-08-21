# Skill: Hot-Path Amplification Analysis

## Purpose
Find repeated client-side work whose cost grows faster than meaningful state changes.

## Trigger
Slow render/event handling, rising CPU/RSS, heavy MCP history, or hot-path code change.

## Inputs
Representative event workload, profiler output, relevant ownership/state code, correctness tests.

## Preconditions
A reproducible workload and stable measurement environment.

## Required context
Only telemetry and code needed to explain copies/wakeups; payload content may be replaced by byte counts.

## Allowed tools
Profiler, allocation/runtime profiler, tests, source inspection, benchmark harness.

## Constraints
Do not optimize without baseline. Do not trade away ownership safety, synchronization, event ordering, or correctness.

## Procedure
1. Capture representative events including payload size, clone count, subscriber count, semantic state-change flag, and duration.
2. Run `hotpath_profiler.py`; record baseline.
3. Rank amplification by copied bytes and redundant wakeups.
4. Form one testable hypothesis: borrow immutable data, avoid unchanged notification, memoize stable formatting, or reduce fanout.
5. Implement the smallest change preserving semantics.
6. Replay the exact workload and compare metrics.
7. Run correctness/event-order tests.
8. Independent verifier reviews equivalence and evidence.

## Decision points
If no metric crosses budget, stop. If a proposed borrow violates ownership/lifetime needs, reject it. If subscriber wakeup is semantically meaningful despite equal value, retain it.

## Expected output
Baseline, hypothesis, change, before/after metrics, correctness evidence, residual risks.

## Metrics
Clone bytes/event, redundant wakeup ratio, p95 duration, amplification ratio.

## Verification
Same workload, same budget, correctness suite, independent review.

## Failure handling
Maximum two hypothesis cycles; after two non-improving attempts stop and escalate with measurements.

## Stop conditions
Budget passes with correctness preserved, or evidence shows the suspected path is not the bottleneck.