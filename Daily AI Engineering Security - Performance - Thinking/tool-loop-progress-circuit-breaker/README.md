# Tool Loop Progress Circuit Breaker

**Category:** Thinking

## Problem
Agent runtimes can repeat identical or semantically equivalent tool calls after success or failure, consuming time, tokens, and side-effect budget while making no measurable progress.

## Evidence
See `evidence/research.md` for current public reports across Hermes Agent, Vercel AI SDK, Google ADK, Qwen Code, PicoClaw, Claude Code, and Codex.

## Existing approach
Common controls are global step caps, warning-only duplicate detection, model self-reflection, and manual cancellation.

## Existing limitations
Step caps are blunt; warning-only guards can be ignored; exact-call matching misses varying-argument/fixed-result loops; runtime replay bugs bypass prompt instructions; hard stops can terminate without a useful recovery handoff.

## Proposed improvement
Use a deterministic progress ledger that fingerprints normalized tool calls and normalized outcomes, tracks evidence of state change, distinguishes read-only and mutating tools, and converts repeated no-progress behavior into a bounded recovery decision rather than another model retry.

## Architecture
- `evidence/research.md` — observed evidence, interpretation, root causes
- `skills/progress-analysis.md` — reusable investigation procedure
- `rules/loop-control.md` — enforceable runtime rules
- `subagents/verification-agent.md` — independent reviewer
- `workflows/diagnose-and-recover.md` — bounded workflow
- `hooks/pre-tool-execution.md` — blocking hook
- `scripts/progress_guard.py` — deterministic circuit breaker
- `tests/test_progress_guard.py` — regression tests

## Installation
Python 3.10+; no third-party dependencies.

## Usage
`python scripts/progress_guard.py --history events.jsonl --candidate candidate.json`

## Metrics
Repeated-call count, repeated-outcome count, no-progress streak, prevented duplicate executions, prevented mutating replays, task completion rate after recovery, tokens and latency avoided.

## Verification
Run `python -m unittest tests/test_progress_guard.py`.

## Safety
Mutating tool replays fail closed sooner than read-only calls. The package does not execute tools; it only emits `allow`, `recover`, or `block` decisions.

## Failure handling
Malformed telemetry blocks deterministic approval. Maximum recovery attempts: 2. After that, stop with evidence and require a changed plan or human intervention.

## Definition of Done
**Implemented:** guard is integrated before tool execution.  
**Measured:** baseline loop traces and post-change prevented-call metrics exist.  
**Verified:** regression tests pass, mutating replays are blocked, productive repeated reads are not incorrectly blocked, and an independent verifier approves the result.

## Customization
Tune thresholds by tool class, but MUST preserve finite retries and stronger controls for mutating actions.
