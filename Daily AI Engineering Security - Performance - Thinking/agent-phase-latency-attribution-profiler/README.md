# Agent Phase Latency Attribution Profiler

**Category:** Performance

## Problem
Agent runs are often measured only by total duration or model latency. That makes slow tasks difficult to optimize because queue wait, workspace preparation, provider startup, orchestration transitions, tool execution, and actual business work collapse into one number.

## Evidence
Current 2026 reports show both the need for phase-level telemetry and concrete orchestration overhead. Multica issue #6859 explicitly requests provider-agnostic phase timing and time-to-first-business-action; OpenCode issue #44515 measures substantially slower loop-to-stream transitions on native Windows than WSL2/Linux on the same machine. OpenCode issue #30067 additionally shows per-step latency growing sharply in long loops because of O(N²) accumulation. See `evidence/research.md`.

## Existing approach and limitation
Broad lifecycle timestamps, total runtime, first-token latency, and provider dashboards are useful but cannot attribute host-side overhead or distinguish cold start from useful work. Teams therefore risk optimizing the wrong component.

## Proposed improvement
Use a versioned phase-event schema and a deterministic profiler that computes phase durations, time to first provider event, time to first business action, and time to first visible output. Compare the same workload before and after a change; optimization claims require an attributable improvement without regression in total runtime or correctness.

## Package tree
```text
README.md
evidence/research.md
skills/phase-latency-investigation.md
rules/performance-evidence.md
subagents/benchmark-verifier.md
workflows/measure-diagnose-optimize.md
hooks/benchmark-gate.md
scripts/phase_latency.py
tests/test_phase_latency.py
```

## Installation
Python 3.10+; no third-party packages.

## Input format
JSONL events containing `run_id`, `phase`, `event` (`start`, `end`, or `mark`), and numeric `ts_ms`. Reserved marks are `provider_event`, `business_action`, and `visible_output`.

## Usage
```bash
python scripts/phase_latency.py trace.jsonl
```

## Workflow
Capture a representative baseline, rank phases by p50/p95 contribution, form one hypothesis, optimize one phase, rerun the same benchmark, then use an independent verifier.

## Metrics
- total runtime
- per-phase duration
- time to first provider event
- time to first business action
- time to first visible output
- orchestration overhead ratio
- phase p50/p95 across repeated runs
- tool/model call counts supplied by host telemetry when available

## Verification
Run `python -m unittest tests/test_phase_latency.py`. A performance improvement is `Measured` only with before/after traces and `Verified` only when the targeted phase improves under the same workload without a material correctness regression.

## Safety
Telemetry MUST exclude prompts, secrets, local paths, tool arguments, and user content unless independently required and protected. Use monotonic timestamps within a process.

## Failure handling
Malformed, overlapping, missing-end, or negative-duration phases fail closed. One collection retry is permitted. If instrumentation itself changes workload behavior materially, stop and use a lower-overhead adapter.

## Definition of Done
**Implemented:** versioned phase events and profiler are integrated. **Measured:** repeated baseline and post-change traces exist. **Verified:** the target metric improves, regression tests pass, correctness is unchanged, and an independent benchmark verifier accepts the evidence.
