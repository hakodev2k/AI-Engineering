# Agent Phase Latency Attribution Profiler

**Category:** Performance

## Problem
Agent wall-clock time is often reported as one number around a tool or turn. That number can mix approval wait, backend queueing, model inference, retry/backoff, host overhead, actual tool execution, and finalization. Recent reports show this can make agents diagnose fast commands as slow, hide multi-minute pre-execution stalls, and leave users unable to identify the real bottleneck.

## Evidence
See `evidence/research.md` for current August 2026 reports from Codex and Claude Code.

## Existing approach
Elapsed turn timers, tool start/result timestamps, provider traces, application logs, progress messages, and ad-hoc stopwatch measurements.

## Existing limitations
Intervals frequently overlap or have ambiguous semantics; approval wait can be attributed to execution; backend/queue delay is often invisible; tool-result envelopes may expose only end-to-end gaps; performance changes are proposed before a phase-level baseline exists.

## Proposed improvement
Instrument the agent lifecycle with explicit non-overlapping phase intervals, calculate phase-exclusive and wall-clock totals deterministically, expose unattributed gaps, and prohibit bottleneck claims unless the responsible phase is measured. Compare before/after traces on equivalent workloads.

## Architecture
```text
README.md
evidence/research.md
skills/phase-latency-investigation.md
rules/latency-attribution-rules.md
subagents/performance-verifier.md
workflows/measure-diagnose-optimize.md
hooks/post-run-latency-profile.md
scripts/profile_latency.py
tests/test_profile_latency.py
```

## Installation
Python 3.9+ only. No external packages.

## Trace format
JSON Lines, one interval per row:
`{"run_id":"r1","phase":"approval_wait","start_ms":1000,"end_ms":61000,"name":"network approval"}`

Allowed phases are not hard-coded; recommended phases are `queue`, `model`, `approval_wait`, `tool`, `retry_backoff`, `host_overhead`, and `finalization`. Intervals in the same run must not overlap; overlaps are treated as invalid evidence.

## Usage
`python3 scripts/profile_latency.py trace.jsonl --json`

## Metrics
- total wall-clock ms per run
- phase-exclusive ms and percentage
- unattributed gap ms
- slowest named intervals
- approval-wait/tool-execution ratio
- before/after p50/p95 per phase across repeated runs

## Workflow
Measure → validate trace semantics → attribute phases → diagnose dominant phase → hypothesize → optimize one cause → measure equivalent workload again → verify no regression.

## Verification
**Implemented:** lifecycle events emit phase intervals. **Measured:** a baseline profile exists. **Verified:** traces contain no overlaps, unexplained gaps are within the chosen budget, optimization improves the targeted phase across repeated comparable runs, and an independent verifier confirms no waiting phase was relabeled as execution.

## Safety
Do not remove approvals, sandbox checks, retries required for correctness, or verification merely to improve latency. Optimizations target waiting/overhead only after semantics are proven.

## Failure handling
Invalid or overlapping intervals invalidate the performance claim. Retry collection up to two runs if instrumentation failed. If queue/provider state makes workloads incomparable, report inconclusive rather than improvement.

## Definition of Done
Current evidence documented; phase taxonomy defined; baseline captured; trace validates; dominant phase identified; optimization targets measured cause; before/after runs are comparable; phase and wall-clock metrics improve as claimed; no security/quality gate weakened; independent verification passes.