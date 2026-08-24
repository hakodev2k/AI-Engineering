# Approval-Wait Latency Attribution Profiler

## Topic
Separate human approval wait from tool execution and model-continuation latency in agent traces.

## Category
Performance

## Problem
Approval-gated agent tools can expose one wall-clock interval that mixes human wait, actual tool execution, and post-tool continuation. If that interval is treated as execution latency, an agent may optimize the wrong component or even change architecture based on a delay caused by the user taking time to approve.

## Evidence
See `evidence/research.md`. The strongest current signal is openai/codex issue #38731 (2026-08-15), which reports an approval-delayed query being treated as multi-minute tool latency even though execution took about 11 seconds. Issue #22312 independently shows `/goal` accounting continuing during approval wait.

## Existing approach
Agent systems typically provide total task timers, approval UI state, tool timestamps, and distributed tracing. These are useful but can remain disconnected, leaving the model or telemetry consumer with a phase-collapsed elapsed time.

## Existing limitations
- Approval and execution events may originate in separate components.
- Progress timers can fire immediately after delayed approval.
- Tool adapters may omit execution-start timestamps.
- Dashboards may intentionally include approval wait in total time without exposing execution-only timing.
- Model narration can turn contaminated timing into a technical diagnosis.

## Proposed improvement
Use a correlated lifecycle contract with explicit timestamps for call creation, approval request/resolution, execution start/end, and continuation completion. Derive separate metrics and reject technical performance conclusions from invalid or phase-collapsed traces.

## Architecture
```text
approval-wait-latency-attribution-profiler/
├── README.md
├── evidence/
│   └── research.md
├── hooks/
│   └── post-tool-timing-check.md
├── rules/
│   └── timing-attribution.md
├── schemas/
│   └── tool-event.schema.json
├── scripts/
│   └── latency_attribution.py
├── skills/
│   └── phase-latency-analysis.md
├── subagents/
│   └── performance-verifier.md
├── tests/
│   └── test_latency_attribution.py
└── workflows/
    └── measure-diagnose-verify.md
```

## Installation
Python 3.10+ only. The profiler uses the standard library and has no external runtime dependency. The JSON Schema is documentation/integration support; the reference script performs its own validation.

## Configuration / input
Provide one JSON object matching `schemas/tool-event.schema.json`. All timestamps for one call must use a compatible clock domain.

Example:
```json
{
  "call_id": "call-17",
  "call_created_ms": 0,
  "approval_requested_ms": 100,
  "approval_resolved_ms": 120100,
  "execution_start_ms": 120100,
  "execution_end_ms": 131100,
  "continuation_end_ms": 132100
}
```
This case yields about 120 s of approval wait but only 11 s of tool execution.

## Usage
```bash
python scripts/latency_attribution.py trace.json --pretty
```
Exit `0` means lifecycle ordering is valid, `1` means timing evidence is invalid, and `2` means malformed/unreadable input.

## Workflow
Follow `workflows/measure-diagnose-verify.md`: Measure baseline → diagnose by phase → form one measurable hypothesis → optimize the evidenced phase → measure again → bounded retry (max 2) → independent verification.

## Metrics
- `approval_wait_ms`
- `tool_execution_ms`
- `continuation_ms`
- `wall_clock_ms`
- `unattributed_ms`
- execution p50/p95
- misattribution count (target 0)
- percentage of tool-latency claims backed by execution-only timing (target 100%)

## Verification
Run from package root:
```bash
python -m unittest discover -s tests -p 'test_*.py'
```
Tests cover a two-minute approval/11-second execution trace, impossible phase ordering, ungated execution, and incomplete approval timestamps.

## Safety
Approval controls are security boundaries. This package separates their latency from tool execution but MUST NOT disable, weaken, or bypass approvals to improve a benchmark. See `rules/timing-attribution.md`.

## Failure handling
Detection: invalid phase order, missing correlation data, or a performance claim based only on wall-clock. Evidence: sanitized phase timestamps and profiler result. Retry: at most two instrumentation/measurement retries with new evidence. Fallback: make no tool-performance conclusion. Escalation: observability/platform owner. Stop: invalid clocks after retries, incomparable baseline, or any optimization that weakens approval/security policy.

## Status model
- **Implemented**: phase-separated profiler and trace contract exist.
- **Measured**: representative baseline and post-change phase metrics are recorded.
- **Verified**: tests pass, execution-only metrics support the stated improvement, and `subagents/performance-verifier.md` independently confirms attribution and comparability.

## Definition of Done
Evidence documented; baseline captured; phase boundaries valid; bottleneck attributed; hypothesis measurable; optimization (if any) targets the evidenced phase; comparable before/after data collected; tests pass; approvals preserved; independent verification complete; no unsupported latency claim remains.

## Customization
Adapters may translate OpenTelemetry spans, tool-host events, or UI approval events into the schema. Preserve a stable call ID and compatible clock domain. If additional phases are added (queueing, network, sandbox startup), keep them separate rather than folding them into execution without evidence.
