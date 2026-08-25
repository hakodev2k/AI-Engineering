# Foreground/Background Handoff Integrity Guard

**Category:** Performance

## Problem
Long-running agent commands can cross from foreground execution into a yielded/background session. If the transition acknowledgement, terminal state, notification, and model wakeup are not correlated reliably, agents can stall, poll repeatedly, duplicate work, or miss output.

## Evidence
`evidence/research.md` documents current Claude Code and Codex reports of missing/duplicate auto-background notifications, lost yielded sessions, indefinite background waits, and polling overhead.

## Existing approach
Fixed foreground wait windows, explicit background flags/session IDs, polling/status calls, completion events, and monitoring subagents.

## Existing limitations
Timeouts cannot distinguish slow healthy work from stalls; polling consumes model turns; session IDs do not prove delivery; notifications can be late/lost/duplicated; monitoring subagents add orchestration cost.

## Proposed improvement
Enforce an observable lifecycle contract around a stable command ID and measure acknowledgement/notification latency. Prefer event-driven wakeup; use only bounded recovery polling.

## Architecture
```text
README.md
evidence/research.md
hooks/post-timeout-handoff-check.md
rules/background-handoff-contract.md
scripts/handoff_guard.py
skills/handoff-latency-diagnosis.md
subagents/handoff-verifier.md
tests/test_handoff_guard.py
workflows/measure-diagnose-recover.md
```

## Installation
Python 3.10+; no third-party packages.

## Configuration
Emit JSONL records with `command_id`, numeric `ts`, and one of: `foreground_started`, `auto_backgrounded`, `background_ack`, `completed`, `failed`, `cancelled`, `notification`, `poll`.

## Usage
`python3 scripts/handoff_guard.py trace.jsonl --ack-deadline 5 --notify-deadline 10 --json`

Exit codes: `0` healthy, `3` lifecycle violations, `2` invalid input/configuration.

## Workflow
Use `workflows/measure-diagnose-recover.md`: Measure → Diagnose → Hypothesize → Optimize → Measure again → independently verify. Maximum two improvement retries and two model-visible recovery polls per transition.

## Metrics
Ack p95, notification p95, missing/late acknowledgements, missing/late notifications, duplicate terminal events, polls while running, polls after terminal, healthy transition rate.

## Verification
Run `python3 -m unittest tests/test_handoff_guard.py`. Production improvement claims additionally require comparable baseline and post-change traces; passing fixtures alone does not prove real-world latency improvement.

## Safety
The guard reads traces only. It never executes, kills, signals, or mutates processes. Implementations must preserve sandbox, approval, cancellation, and permission boundaries.

## Failure handling
On violation, preserve the trace and diagnose the first broken lifecycle boundary. Do not rerun an uncertain side-effecting command. Stop after two unsuccessful implementation cycles and escalate.

## Definition of Done
**Implemented:** stable lifecycle tracing and guard integration exist.  
**Measured:** comparable before/after workload traces are collected.  
**Verified:** tests pass, configured deadlines hold on post-change traces, polling/duplication does not regress, and safety boundaries remain unchanged.

## Customization
Adjust deadlines to workload/runtime SLOs before collecting the baseline; do not move thresholds after seeing results to manufacture success.
