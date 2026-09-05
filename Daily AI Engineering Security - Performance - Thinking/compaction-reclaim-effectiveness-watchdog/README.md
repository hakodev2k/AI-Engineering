# Compaction Reclaim Effectiveness Watchdog

**Category:** Token  
**Run date:** 2026-09-05 (UTC+7)

## Problem
Agent context compaction can report success yet reclaim little or no context, or stale accounting can immediately restore pre-compaction usage and retrigger compaction. The system then burns tokens/latency in a compaction loop while losing useful history or eventually overflowing the context window.

## Evidence
See `evidence/research.md`.

## Existing approach
Agent frameworks trigger compaction at a utilization threshold, summarize older turns, rotate transcripts, and track context usage. Some systems expose watchdogs or compaction records.

## Existing limitations
A successful compaction event is often treated as proof that memory pressure was relieved. That misses postcondition failures: zero reclaim, stale post-compaction counters, repeated compactions without enough intervening growth, or summaries that consume nearly the reclaimed space.

## Proposed improvement
Require a measurable compaction postcondition. Capture tokens before/after, reclaimed ratio, utilization after compaction, and time/turns since the previous compaction. Block repeated automatic compaction when the last attempt was ineffective; switch to bounded recovery (recount -> diagnose injected/static context -> fallback/reset with approval) rather than thrashing.

## Architecture
- `skills/compaction-effectiveness-analysis.md`
- `rules/compaction-postconditions.md`
- `subagents/token-verifier.md`
- `workflows/measure-diagnose-recover.md`
- `hooks/post-compaction.md`
- `scripts/compaction_watchdog.py`
- `config/policy.example.json`
- `examples/events.jsonl`
- `tests/test_compaction_watchdog.py`
- `evidence/research.md`

## Installation
Python 3.10+, standard library only.

## Usage
`python scripts/compaction_watchdog.py config/policy.example.json examples/events.jsonl`

Exit 0 = effective/no blocking pattern; 5 = ineffective or thrashing compaction; 1 = invalid input.

## Workflow
Measure baseline compaction behavior -> diagnose reclaim failure -> form hypothesis -> fix accounting/retention/injected-context behavior -> replay workload -> measure again -> independent token/quality verification.

## Metrics
Tokens before/after compaction; reclaimed tokens; reclaim ratio; post-compaction utilization; compactions/task; time and turns between compactions; summary tokens; latency; task quality; critical-context-loss incidents.

## Verification
**Implemented:** deterministic postcondition checker, rules, tests and bounded recovery workflow.  
**Measured:** before/after metrics are captured for each compaction event.  
**Verified:** known zero-reclaim/retrigger traces block; healthy compactions pass; workload shows lower compactions/task and token/latency cost without critical context loss or task-quality regression.

## Safety
Never delete required task, security, user or verification context simply to satisfy a reclaim target. Unknown context accounting blocks automatic threshold tuning. Destructive session reset requires explicit approval when user work could be lost.

## Failure handling
One recount attempt is allowed after an ineffective compaction. One remediation/replay cycle is allowed. If the next compaction remains ineffective, disable automatic repeated compaction for that session and escalate rather than loop indefinitely.

## Definition of Done
Evidence documented; baseline captured; reclaim postconditions configured; tests pass; before/after measurements collected; no thrash trace remains; quality/context-loss checks pass; independent verifier confirms the result.
