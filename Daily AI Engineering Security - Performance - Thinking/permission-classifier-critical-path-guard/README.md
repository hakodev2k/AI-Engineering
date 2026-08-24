# Permission Classifier Critical-Path Guard

**Category:** Performance

## Problem
Tool-call latency can be dominated by model-based permission classification or the handoff after classification, while dashboards and operators blame the underlying tool. Current incidents show multi-minute pre-execution waits, persistent classifier unavailability, and hangs after classifier completion.

## Evidence
See `evidence/research.md`. August 2026 public reports document ~305–329s classifier waits before 1–2s tool executions, weeks-long classifier unavailability, repeated failures on read-only MCP actions, and extension hangs after classifier completion.

## Existing approach
Teams typically rely on generic tool timers, whole-turn timers, fixed timeouts, retries, restarts, or permission-mode changes.

## Existing limitations
Those approaches collapse distinct phases into one latency number, can retry deterministic failures, can destroy warm session/cache state, and may tempt operators to bypass safety controls.

## Proposed improvement
Treat permission handling as a first-class state machine with independent spans for classifier wait, manual approval, post-classifier dispatch, and actual tool execution. Enforce budgets and bounded retries, classify failures precisely, and fall back safely to explicit approval or suspension rather than unsafe execution.

## Architecture
```text
tool proposed
  -> classifier_start -> classifier_end
  -> optional approval_start -> approval_end
  -> tool_dispatch -> tool_result
        |                |
        +-- trace analyzer + SLO/violation report
```

## Package tree
```text
permission-classifier-critical-path-guard/
├── README.md
├── evidence/research.md
├── hooks/pre-dispatch-latency-budget.md
├── rules/permission-path-performance-rules.md
├── scripts/analyze_permission_trace.py
├── skills/permission-path-baseline.md
├── subagents/permission-performance-investigator.md
├── tests/test_permission_trace_analyzer.py
└── workflows/measure-diagnose-optimize.md
```

## Installation
Python 3.9+ only; analyzer has no third-party dependencies. Instrument the host to emit the documented JSONL events with a stable `op_id` and millisecond timestamps.

## Configuration
Default investigation budgets:
- classifier: 30,000 ms;
- classifier-end→tool-dispatch gap: 5,000 ms.

Override these only when the runtime has a documented contract requiring different values.

## Usage
```bash
python3 scripts/analyze_permission_trace.py trace.jsonl \
  --classifier-budget-ms 30000 \
  --dispatch-budget-ms 5000
```
Exit code 0: structurally valid trace with no budget violations. Exit code 1: one or more latency violations. Exit code 2: malformed input/configuration.

Run unit tests:
```bash
python3 -m unittest tests/test_permission_trace_analyzer.py
```

## Workflow
Use `workflows/measure-diagnose-optimize.md`: Measure baseline → identify dominant span → form one hypothesis → implement one safe change → measure again → independently verify. Maximum two optimization iterations.

## Metrics
Classifier p50/p95/p99; dispatch-gap p95; actual execution p95; authorization share of end-to-end time; repeated classifier errors; budget violation rate; manual-fallback rate; task success.

## Verification
A performance improvement is valid only when the targeted latency/retry metric improves on the same workload and permission/sandbox behavior remains unchanged or stronger. A fast result obtained by disabling controls is a failed verification.

## Safety
Classifier timeout or unavailability never authorizes execution by itself. Safe fallback is explicit manual approval, task suspension, or a pre-existing deterministic policy decision. Traces should redact/hide command payloads and secrets when identifiers are sufficient.

## Failure handling
Detection: analyzer violation or malformed trace. Evidence: phase-level timings and error counts. Retry: at most two classifier attempts per logical action, with bounded backoff; deterministic malformed-request errors are not retried. Fallback: manual approval/task suspension. Escalation: persistent external outage or unknown state. Stop: verified improvement, two failed iterations, or next optimization would weaken security.

## Definition of Done
**Implemented:** trace schema semantics, rules, baseline skill, investigator, workflow, hook, analyzer, tests, and research exist. **Measured:** representative before/after traces are analyzed. **Verified:** latency/retry waste is lower, task success is not worse, security boundaries are preserved, and independent review confirms attribution.

## Customization
Hosts may add phase events such as queue wait, policy evaluation, or UI rendering. Keep classifier, approval, dispatch, and execution spans distinct so optimization remains attributable.