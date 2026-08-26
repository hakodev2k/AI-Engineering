# Repeated Tool-Call Progress Watchdog

**Category:** Thinking

## Problem
Long-running AI agents can enter repeated identical or functionally equivalent tool-call loops that consume tokens and time without producing new state. Blunt step caps either stop useful long tasks too early or allow stuck tasks to burn their full budget.

## Evidence
See `evidence/research.md` for current August 2026 reports from OpenAI Codex, Vercel AI SDK, and Hermes Agent.

## Existing approach
Common controls are maximum-step limits, model-authored stop conditions, retry caps, and manual cancellation.

## Existing limitations
Step limits measure activity rather than progress; model-authored stop decisions can fail inside the same loop; equivalent calls can differ syntactically; orchestration systems often lack a deterministic progress ledger.

## Proposed improvement
Add an observable progress watchdog that fingerprints tool calls, records state-changing evidence, detects repeated calls without progress, and forces bounded recovery or escalation.

## Package tree
- `evidence/research.md`
- `config/watchdog.json`
- `scripts/progress_watchdog.py`
- `tests/test_progress_watchdog.py`
- `skills/progress-diagnosis.md`
- `rules/loop-safety.md`
- `subagents/verification-agent.md`
- `workflows/run-with-progress-gates.md`
- `hooks/post-tool-call.md`

## Installation
Python 3.10+. No third-party dependencies.

## Usage
`python scripts/progress_watchdog.py --trace trace.jsonl --config config/watchdog.json`

Each JSONL row must include `tool`, `args`, and `progress`; `progress` is true only when independently observable state changed toward the task goal.

## Metrics
Repeated-call streak, no-progress streak, tokens spent since last progress, recovery count, unsupported-completion rate, task completion rate.

## Verification
Run `python -m unittest tests/test_progress_watchdog.py`.

## Safety
The watchdog never authorizes destructive actions. Recovery must not weaken permissions, verification, or required context.

## Failure handling
Detection is deterministic. Maximum recovery attempts: 2. Fallback: stop tool execution and escalate with the trace evidence.

## Definition of Done
**Implemented:** hook and watchdog integrated. **Measured:** baseline traces captured. **Verified:** regression tests pass and repeated no-progress loops stop within configured bounds without terminating productive traces.
