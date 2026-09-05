# Successful Tool Loop Progress Guard

**Category:** Thinking  
**Run date:** 2026-09-05 (UTC+7)

## Problem
Agents can loop indefinitely even when every tool call succeeds. Failure counters, retry limits, and exception handlers do not stop cycles such as repeated `list/search/read` actions that return valid but non-progressing results. This wastes tokens/time and can make long-running tasks unreliable.

## Evidence
See `evidence/research.md`.

## Existing approach and limitation
Frameworks commonly cap failed tool calls, total iterations, or wall-clock runtime. Those are useful safety nets, but they do not identify semantic non-progress when calls are individually successful. Very high global iteration caps can still burn substantial budget before termination.

## Proposed improvement
Add an observable progress ledger independent of hidden reasoning. Each tool event records normalized action, target, result fingerprint, and a monotonic progress marker. A deterministic detector blocks repeated successful cycles when no progress marker advances inside a bounded window.

## Architecture
- `skills/progress-loop-investigation.md`
- `rules/bounded-agent-reasoning.md`
- `subagents/progress-verifier.md`
- `workflows/diagnose-and-recover.md`
- `hooks/post-tool-progress.md`
- `scripts/progress_loop_guard.py`
- `config/guard.example.json`
- `tests/test_progress_loop_guard.py`
- `evidence/research.md`

## Installation
Python 3.10+, standard library only.

## Configuration
Choose a small `window` and `max_identical_cycles` appropriate to the workflow. Define progress externally: new evidence ID, resolved subtask, changed repository state, test-state transition, or another task-specific observable marker.

## Usage
Feed JSONL events to `python scripts/progress_loop_guard.py config/guard.example.json events.jsonl`. Exit 0 means no blocking loop; exit 4 means repeated successful non-progress detected; exit 1 means invalid input.

## Workflow
Observe trace -> establish baseline loop cost -> classify facts/assumptions/hypotheses -> define progress marker -> replay detector -> change planner/recovery policy -> replay -> independent verification.

## Metrics
Repeated identical action-target-result cycles; tool calls without progress; tokens/time before loop detection; recovery success rate; unsupported conclusion rate; rework; task completion.

## Verification
**Implemented:** deterministic detector, bounded workflow, rules, tests.  
**Measured:** baseline and guarded traces record calls/tokens/time before termination or progress.  
**Verified:** known loop traces are blocked within configured bound; legitimate repeated calls with advancing progress are not blocked; independent reviewer confirms task completion evidence.

## Safety
The detector never asks for or stores hidden chain-of-thought. It operates only on observable events and task-state markers. Dangerous recovery actions require human approval.

## Failure handling
Malformed traces fail closed. Recovery may run at most twice: first change strategy/tool/query, then escalate or stop with collected evidence. Never increase limits repeatedly to hide a loop.

## Definition of Done
Current evidence documented; baseline captured; progress semantics explicit; loop fixture blocked; progress fixture passes; retry bounds enforced; verification coverage recorded; no unsupported success conclusion remains.

## Customization
Replace the default fingerprint fields with domain-specific observable state, while retaining bounded retries and monotonic progress semantics.