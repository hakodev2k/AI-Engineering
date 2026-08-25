# Approval-Wait Latency Attribution Guard

**Category:** Thinking  
**Status:** Implemented reference package; verification is deterministic against supplied traces.

## Problem
Agent runtimes can collapse human approval wait, tool execution, and post-tool processing into one wall-clock duration. When that blended duration is exposed to the model or analytics as tool latency, the agent can form a false performance diagnosis and change implementation strategy on unsupported evidence.

## Evidence
Current evidence and source links are in `evidence/research.md`. Recent Codex and Claude Code reports independently show approval-pending time being counted or structurally indistinguishable from execution time.

## Existing approach and limitation
Wall-clock timing and paired `tool_use`/`tool_result` timestamps are useful for user-perceived duration, but they do not prove execution duration. Generic progress timers and dashboards can therefore misattribute waiting to the tool.

## Proposed improvement
Require lifecycle-aware timing evidence before any performance conclusion: record approval request/decision, execution start/finish, and result-processing boundaries separately. Treat missing boundaries as `unknown`, never as execution time.

## Architecture
- `skills/latency-attribution-analysis.md` — evidence-driven diagnosis procedure.
- `rules/timing-evidence-rules.md` — enforceable attribution rules.
- `subagents/timing-verifier.md` — independent verifier contract.
- `workflows/measure-diagnose-verify.md` — bounded improvement workflow.
- `hooks/post-tool-timing-check.md` — deterministic completion gate.
- `scripts/attribution_guard.py` — JSONL trace validator and metric calculator.
- `tests/test_attribution_guard.py` — regression tests.
- `evidence/research.md` — observed evidence, interpretation, and sources.

## Installation
Requires Python 3.10+ and no third-party packages.

## Usage
```bash
python3 scripts/attribution_guard.py trace.jsonl
python3 -m unittest tests/test_attribution_guard.py
```

## Input contract
Each JSONL record contains `tool_id`, `event`, and `ts_ms`. Recognized events are `approval_requested`, `approval_decided`, `execution_started`, `execution_finished`, and `result_consumed`.

## Output
The validator emits JSON per tool with `approval_wait_ms`, `execution_ms`, `postprocess_ms`, `wall_ms`, `status`, and violations. Exit code 0 means all observed performance-attribution boundaries are valid; 2 means attribution is unsafe; 1 means invalid input.

## Workflow
Observe → capture baseline lifecycle trace → diagnose attribution gaps → instrument missing boundaries → capture again → independently verify. The workflow allows at most two instrumentation/measurement retries.

## Metrics
`attributable_tool_ratio`, `ambiguous_tool_count`, `approval_wait_ms`, `execution_ms`, `postprocess_ms`, and `false_slow_tool_decisions` found during review.

## Verification
**Implemented:** lifecycle validator and rules exist.  
**Measured:** a real trace has separate timing components.  
**Verified:** tests pass, no tool is labelled slow from wall time when execution duration is unknown, and an independent verifier confirms decisions use execution-only evidence.

## Safety
This package never relaxes approval requirements. Approval delay is preserved as user-perceived latency but MUST NOT be reclassified as execution time.

## Failure handling
Malformed or incomplete traces fail closed for performance attribution. Retry instrumentation at most twice; if execution boundaries remain unavailable, report execution latency as unknown and escalate instrumentation rather than guessing.

## Definition of Done
Evidence documented; baseline captured; lifecycle boundaries instrumented; tests pass; before/after attribution compared; ambiguous tools are not used as performance evidence; independent verification complete; no approval/security control weakened.

## Customization
Adapters may translate native telemetry into the event contract, but MUST preserve event ordering and original timestamps.