# Single Tool Deadline Parity Guard

**Category:** Performance  
**Run date:** 2026-09-06 (UTC+7)

## Problem
Agent runtimes can enforce deadlines for parallel batches while leaving the lone/sequential tool path unbounded. One stalled network, MCP, stream, or subprocess call can then wedge an entire turn for minutes or hours even though the same runtime already has timeout semantics elsewhere.

## Evidence
See `evidence/research.md`.

## Existing approach
Frameworks use total-turn timeouts, MCP startup timeouts, per-call deadlines, idle timeouts, outer process watchdogs, cancellation, and retry policies. The remaining weakness is semantic inconsistency: startup timeout is not tool-call timeout; total wall-clock timeout is not liveness/idle timeout; and parallel-path guards may not cover sequential execution.

## Proposed improvement
Define one tool-execution deadline contract and verify parity across every execution path. Each call must have a finite hard deadline plus optional idle/progress deadline, emit a normalized timeout disposition, cancel/cleanup underlying work, and retry only when the tool is explicitly safe and the failure is transient.

## Architecture
- `evidence/research.md`
- `skills/tool-deadline-investigation.md`
- `rules/tool-liveness-rules.md`
- `subagents/performance-verifier.md`
- `workflows/measure-harden-benchmark.md`
- `hooks/pre-release-deadline-check.md`
- `scripts/check_tool_deadlines.py`
- `config/deadlines.example.json`
- `tests/test_check_tool_deadlines.py`

## Installation
Python 3.10+; standard library only.

## Configuration
Declare every execution path (single, sequential, parallel, MCP/remote, subprocess, workflow-agent where applicable), finite hard timeout, optional idle timeout, cancellation support, normalized timeout result, and retry behavior.

## Usage
`python scripts/check_tool_deadlines.py config/deadlines.example.json`

Exit codes: 0 pass, 2 blocking liveness violation, 1 invalid input/runtime error.

## Workflow
Measure baseline hang duration -> map all call paths -> diagnose timeout asymmetry -> hypothesize unified deadline semantics -> implement -> replay stalled fixtures -> compare time-to-recovery and cleanup -> independent verification.

## Metrics
P95/P99 tool latency; time-to-timeout; time-to-agent-recovery; wedged turns; orphan subprocesses/connections; timeout disposition coverage; retry count; false timeout rate; task success rate.

## Verification
**Implemented:** finite deadline contract, checker, rules, bounded workflow, tests.  
**Measured:** baseline vs guarded stalled-call recovery time and normal-call latency.  
**Verified:** every execution path terminates within configured tolerance; cancellation cleanup succeeds; normal long-running tools remain configurable; no infinite retry path exists.

## Safety
Do not shorten deadlines blindly. Long-running valid tools require explicit budgets or progress/idle semantics. Never retry destructive/non-idempotent calls automatically after ambiguous timeout.

## Failure handling
A missing deadline or cleanup capability blocks release. Remediation gets at most two cycles. If a tool cannot be safely cancelled, isolate it behind an outer killable process/worker or escalate rather than accepting an unbounded wait.

## Definition of Done
Evidence documented; baseline captured; all paths inventoried; finite deadlines enforced; stalled fixtures recover; cleanup verified; normal workload benchmarked; retries bounded; independent verifier signs off.

## Customization
Set path-specific hard/idle limits from measured production distributions, preserving finite upper bounds.