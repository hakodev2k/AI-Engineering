# Agent SDK Control-Stream Liveness Guard

**Category:** Performance

## Problem
Agent SDK hosts can close the bidirectional control stream while a model turn, permission request, in-process MCP tool, or background subagent still needs it. Public Claude Agent SDK reports show `Stream closed` failures after streaming input completion, after an early result, and during background subagent work. This converts normal multi-tool work into failed calls, retries, stalls, and lost side effects.

## Evidence
See `evidence/research.md`. Independent reports include anthropics/claude-agent-sdk-typescript issues #348, #359, #376 and #385 from June–July 2026.

## Existing approach and limitation
Workarounds include avoiding streaming input, keeping debug enabled, retrying queries, or restructuring prompts. These are fragile because they do not assert the actual lifecycle invariant: the control channel must remain writable until all operations that depend on it are settled or cancelled.

## Proposed improvement
Measure the lifecycle first, then introduce a host-side liveness contract: maintain counts for active turns, outstanding control requests and background workers; prohibit transport close while any count is non-zero; record close attempts and rejected requests; bound cancellation/settlement waits. The included analyzer validates event traces and provides a regression oracle independent of any one SDK.

## Package tree
- `evidence/research.md`
- `skills/control-stream-investigation.md`
- `rules/control-stream-liveness.md`
- `subagents/performance-investigator.md`
- `workflows/measure-diagnose.md`
- `workflows/enforce-and-benchmark.md`
- `hooks/post-run-liveness-check.md`
- `scripts/control_stream_guard.py`
- `tests/test_control_stream_guard.py`

## Installation
Python 3.10+, no third-party dependencies.

## Trace format
Newline-delimited JSON with events: `turn_start`, `turn_end`, `control_open`, `control_settle`, `worker_start`, `worker_end`, `transport_close`, `tool_failure`. Optional `ts_ms` enables latency metrics. IDs are required for tracked entities.

## Usage
`python scripts/control_stream_guard.py trace.ndjson`

Exit codes: `0` invariant holds; `2` premature-close or lifecycle-integrity violation; `64` malformed input.

## Workflow
Observe → capture trace → baseline failure/stall/retry rate → diagnose close ordering → implement lifecycle barrier → replay/benchmark → independently verify.

## Metrics
- premature close attempts/run
- `Stream closed` tool failures/run
- failed tool-call rate
- retry count
- time from final dependent operation settlement to transport close
- p50/p95 turn latency
- background-worker completion rate

## Verification
Run `python -m unittest tests/test_control_stream_guard.py`. Production verification also requires traces from representative multi-tool and background-subagent workloads with zero premature close events and no regression in turn latency beyond the team's stated budget.

## Safety
Do not keep channels alive indefinitely. Cancellation and shutdown MUST be bounded. Do not retry state-changing tools unless idempotency or outcome reconciliation is established.

## Failure handling
Malformed trace blocks verification. A premature close is a blocking regression. Retry the workload at most twice to distinguish nondeterminism; then preserve evidence and escalate rather than hiding the failure with debug logging or unbounded retries.

## Definition of Done
**Implemented:** lifecycle barrier is active. **Measured:** before/after traces and latency/retry metrics captured. **Verified:** deterministic tests and representative workloads show no close while dependent work is active, with bounded shutdown and acceptable performance.
