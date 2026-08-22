# Agent UI Hot-Path Work Amplification Profiler

Category: Performance

## Problem
Long-running agent clients can repeatedly clone large tool-call/history payloads and wake subscribers even when relevant state has not changed. This multiplies allocations, CPU work, memory pressure, and render latency as sessions grow.

## Evidence
See `evidence/research.md`. On 2026-08-12 OpenAI merged Codex PR #38103 to borrow MCP invocation data instead of cloning it during TUI history rendering, and PR #38170 to avoid waking running-turn subscribers when the count is unchanged. These are separate hot-path examples of the same avoidable-work pattern.

## Existing approach and limitation
Individual clone removals, memoization, reactive watchers, and UI virtualization help. However, without workload-level measurement, another clone/wakeup can re-enter a hot path and regress silently as histories or subscriber counts grow.

## Proposed improvement
Profile repeated event/render paths with a small workload ledger: payload bytes, clone count/bytes, subscriber wakeups, actual state changes, render/event count, and duration. Optimize only measured amplification, then compare identical workloads before/after and enforce a regression budget.

## Package tree
- `evidence/research.md`
- `config/budget.json`
- `skills/hotpath-amplification-analysis.md`
- `rules/performance-evidence-policy.md`
- `subagents/benchmark-verifier.md`
- `workflows/measure-optimize-verify.md`
- `scripts/hotpath_profiler.py`
- `tests/test_hotpath_profiler.py`

## Installation
Python 3.10+, standard library only.

## Usage
Create JSONL events with `payload_bytes`, `clone_count`, `subscriber_count`, `state_changed`, and `duration_ms`, then run:
`python scripts/hotpath_profiler.py events.jsonl --budget config/budget.json`

## Metrics
Clone bytes/event, redundant wakeups/event, no-change event ratio, p95 duration, total copied bytes, and amplification ratio.

## Safety
Do not remove copies required for ownership/lifetime/thread-safety correctness. Do not suppress notifications whose semantics require edge events even when values compare equal. Correctness tests are mandatory before accepting a performance win.

## Failure handling
Invalid telemetry blocks comparison. If optimization changes observable behavior, revert it and re-form the hypothesis. Maximum two optimization/rebenchmark cycles.

## Verification
Run `python -m unittest tests/test_hotpath_profiler.py`, then benchmark the same captured workload before and after. Independent verifier confirms both metric improvement and behavior parity.

## Definition of Done
Implemented: measured hot-path duplication is reduced. Measured: before/after workload metrics exist. Verified: correctness tests pass, p95/clone/wakeup budgets pass, no required events are lost, and independent review confirms the comparison is equivalent.

## Customization
Adjust budgets to workload size and platform. Add allocator or runtime-specific telemetry while preserving normalized JSONL fields.